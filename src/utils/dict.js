import { axios } from '@/utils/request'
const api = {
  dictData: '/system/dict/data'
}

// 字典两种用法，各有优缺点
// 1.Map 需要数组的时候构造数组不方便
// operTypeMap = await getDictMap('sys_oper_type')
// this.operTypeMap = operTypeMap
// this.operTypeMap.forEach((value, key, mymap) => {
//   this.businessTypes.push({ code: key, label: value })
// })
// 2.数组 在modal调用没有map方便
// this.businessTypes = await getDictArray('sys_oper_type')
// this.businessTypes.map(d => {
//   operTypeMap[d.dictValue] = { text: d.dictLabel }
// })
// this.operTypeMap = operTypeMap

/**
 * 根据类型获取字典内容 返回Map
 * @param {String} dictType 字典类型
 */
export function getDictMap (dictType) {
  return new Promise((resolve, reject) => {
  // ajax
    axios({
      url: api.dictData + '/type',
      method: 'get',
      params: { 'dictType': dictType }
    }).then(res => {
      const map = new Map()
      res.map(d => {
        map.set(d.dictValue, d.dictLabel)
      })
      resolve(map)
    }).catch(err => {
      reject(err)
    })
  })
}
/**
 * 根据类型获取字典内容 返回数组
 * @param {String} dictType 字典类型
 */
export function getDictArray (dictType) {
  return axios({
    url: api.dictData + '/type',
    method: 'get',
    params: { 'dictType': dictType }
  })
}
