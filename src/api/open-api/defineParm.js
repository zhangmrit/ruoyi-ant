import { axios } from '@/utils/request'

const api = {
  defineParm: '/open-api/defineParm'
}

export function getDefineParmList (parameter) {
  return axios({
    url: api.defineParm + '/list',
    method: 'get',
    params: parameter
  })
}

export function saveDefineParm (parameter) {
  return axios({
    url: api.defineParm + (parameter.id > 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delDefineParm (parameter) {
  return axios({
    url: api.defineParm + '/remove',
    method: 'post',
    params: parameter
  })
}

export const defineParmExport = api.defineParm + '/export'
