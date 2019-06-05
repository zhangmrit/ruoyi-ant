import { axios } from '@/utils/request'
const api = {
  dictData: '/system/dict/data'
}
/**
 * 根据类型获取字典内容
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
