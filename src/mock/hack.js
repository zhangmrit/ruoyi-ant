/* eslint-disable */
import Mock from 'mockjs2'

const { Util, XHR: MockXMLHttpRequest } = Mock
const XHR_EVENTS = 'readystatechange loadstart progress abort error load timeout loadend'.split(' ')
const XHR_REQUEST_PROPERTIES = 'timeout withCredentials'.split(' ')
const XHR_RESPONSE_PROPERTIES = 'readyState responseURL status statusText responseType response responseText responseXML'.split(' ')
function createNativeXMLHttpRequest() {
  var isLocal = (function() {
    var rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/
    var rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/
    var ajaxLocation = location.href
    var ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || []
    return rlocalProtocol.test(ajaxLocParts[1])
  })()
  return window.ActiveXObject ? (!isLocal && createStandardXHR()) || createActiveXHR() : createStandardXHR()
  function createStandardXHR() {
    try {
      return new window._XMLHttpRequest()
    } catch (e) {}
  }
  function createActiveXHR() {
    try {
      return new window._ActiveXObject('Microsoft.XMLHTTP')
    } catch (e) {}
  }
}
function find(options) {
  for (var sUrlType in MockXMLHttpRequest.Mock._mocked) {
    var item = MockXMLHttpRequest.Mock._mocked[sUrlType]
    if (
      (!item.rurl || match(item.rurl, options.url)) &&
      (!item.rtype || match(item.rtype, options.type.toLowerCase()))
    ) {
      return item
    }
  }

  function match(expected, actual) {
    if (Util.type(expected) === 'string') {
      return expected === actual
    }
    if (Util.type(expected) === 'regexp') {
      return expected.test(actual)
    }
  }
}
/** 原方法中的注释已经移除，下面方法内的注释都是hack的说明 */
Mock.XHR.prototype.open = function(method, url, async, username, password) {
  var that = this

  Util.extend(this.custom, {
    method: method,
    url: url,
    async: typeof async === 'boolean' ? async : true,
    username: username,
    password: password,
    options: {
      url: url,
      type: method
    }
  })

  this.custom.timeout = (function(timeout) {
    if (typeof timeout === 'number') return timeout
    if (typeof timeout === 'string' && !~timeout.indexOf('-')) return parseInt(timeout, 10)
    if (typeof timeout === 'string' && ~timeout.indexOf('-')) {
      var tmp = timeout.split('-')
      var min = parseInt(tmp[0], 10)
      var max = parseInt(tmp[1], 10)
      return Math.round(Math.random() * (max - min)) + min
    }
  })(MockXMLHttpRequest._settings.timeout)

  var item = find(this.custom.options)

  function handle(event) {
    for (var i = 0; i < XHR_RESPONSE_PROPERTIES.length; i++) {
      try {
        that[XHR_RESPONSE_PROPERTIES[i]] = xhr[XHR_RESPONSE_PROPERTIES[i]]
      } catch (e) {}
    }
    that.dispatchEvent(new Event(event.type))
  }

  if (!item) {
    var xhr = createNativeXMLHttpRequest()
    this.custom.xhr = xhr

    for (var i = 0; i < XHR_EVENTS.length; i++) {
      xhr.addEventListener(XHR_EVENTS[i], handle)
    }

    if (username) xhr.open(method, url, async, username, password)
    else xhr.open(method, url, async)

    for (var j = 0; j < XHR_REQUEST_PROPERTIES.length; j++) {
      try {
        xhr[XHR_REQUEST_PROPERTIES[j]] = that[XHR_REQUEST_PROPERTIES[j]]
      } catch (e) {}
    }
    // 这里的核心问题就是没考虑到在open以后去修改属性 比如axios修改responseType的行为就在open之后
    Object.defineProperty(that, 'responseType', {
      get() {
        return xhr.responseType
      },
      set(v) {
        return (xhr.responseType = v)
      }
    })

    return
  }

  this.match = true
  this.custom.template = item
  this.readyState = MockXMLHttpRequest.OPENED
  this.dispatchEvent(new Event('readystatechange'))
}
