import { axios } from '@/utils/request'

const api = {
  datasource: '/open-api/datasource'
}

export function getDatasourceList (parameter) {
  return axios({
    url: api.datasource + '/list',
    method: 'get',
    params: parameter
  })
}

export function saveDatasource (parameter) {
  return axios({
    url: api.datasource + (parameter.id > 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delDatasource (parameter) {
  return axios({
    url: api.datasource + '/remove',
    method: 'post',
    params: parameter
  })
}

export const datasourceExport = api.datasource + '/export'
