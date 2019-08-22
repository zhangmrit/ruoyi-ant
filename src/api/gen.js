import { axios } from '@/utils/request'

const api = {
  gen: '/gen'
}

export default api

export function getGenList (parameter) {
  return axios({
    url: api.gen + '/list',
    method: 'get',
    params: parameter
  })
}
export function getDbList (parameter) {
  return axios({
    url: api.gen + '/db/list',
    method: 'get',
    params: parameter
  })
}
export function delGen (parameter) {
  return axios({
    url: api.gen + '/remove',
    method: 'post',
    params: parameter
  })
}
export function editGen (parameter) {
  return axios({
    url: api.gen + '/edit',
    method: 'get',
    params: parameter
  })
}
export function editSaveGen (parameter) {
  return axios({
    url: api.gen + '/edit',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function importTable (parameter) {
  return axios({
    url: api.gen + '/importTable',
    method: 'post',
    params: parameter
  })
}
export function preview (tebleId) {
  return axios({
    url: api.gen + '/preview/' + `${tebleId}`,
    method: 'get'
  })
}

export const batchGenCode = api.gen + '/batchGenCode'
