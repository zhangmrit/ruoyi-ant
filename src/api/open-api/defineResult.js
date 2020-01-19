import { axios } from '@/utils/request'

const api = {
  defineResult: '/open-api/defineResult'
}

export function getDefineResultList (parameter) {
  return axios({
    url: api.defineResult + '/list',
    method: 'get',
    params: parameter
  })
}

export function saveDefineResult (parameter) {
  return axios({
    url: api.defineResult + (parameter.id > 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delDefineResult (parameter) {
  return axios({
    url: api.defineResult + '/remove',
    method: 'post',
    params: parameter
  })
}

export const defineResultExport = api.defineResult + '/export'
