import Vue from 'vue'
import { pureAxios, axios } from '@/utils/request'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const downloadUrl = '/system/common/download'

export function exportPost (url, params) {
  axios({
    url: url,
    method: 'post',
    params: params
  }).then(res => {
    if (res.code === 0) {
      download(res.msg)
    }
  })
}

export function download (filename) {
  const token = Vue.ls.get(ACCESS_TOKEN)
  pureAxios({
    url: downloadUrl,
    method: 'get',
    params: { fileName: filename, delete: true },
    responseType: 'blob',
    headers: {
      'token': token
    }
  }).then(res => {
    const aLink = document.createElement('a')
    var blob = new Blob([res.data], { type: 'application/octet-stream' })
    // //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; fileName=xxxx.docx") 设置的文件名;
    var patt = new RegExp('fileName=([^;]+\\.[^\\.;]+);*')
    var contentDisposition = decodeURI(res.headers['content-disposition'])
    var result = patt.exec(contentDisposition)
    var fileName = result[1]
    aLink.href = URL.createObjectURL(blob)
    aLink.setAttribute('download', fileName) // 设置下载文件名称
    document.body.appendChild(aLink)
    aLink.click()
    document.body.appendChild(aLink)
  })
}
