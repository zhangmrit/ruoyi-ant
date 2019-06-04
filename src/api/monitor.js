import { axios } from '@/utils/request'

const api = {
  operLog: '/system/operLog'
}

export default api

// OperLog
export function getOperLogList (parameter) {
  return axios({
    url: api.operLog + '/list',
    method: 'get',
    params: parameter
  })
}

export function delOperLog (parameter) {
  return axios({
    url: api.operLog + '/remove',
    method: 'post',
    params: parameter
  })
}
export function cleanOperLog () {
  return axios({
    url: api.operLog + '/clean',
    method: 'post'
  })
}
