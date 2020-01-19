import { axios } from '@/utils/request'

const api = {
  define: '/open-api/define'
}

export function getDefineList (parameter) {
  return axios({
    url: api.define + '/list',
    method: 'get',
    params: parameter
  })
}

export function getDefine (apiId) {
  return axios({
    url: api.define + '/get/' + apiId,
    method: 'get'
  })
}

export function saveDefine (parameter) {
  return axios({
    url: api.define + (parameter.id > 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delDefine (parameter) {
  return axios({
    url: api.define + '/remove',
    method: 'post',
    params: parameter
  })
}

export const defineExport = api.define + '/export'
