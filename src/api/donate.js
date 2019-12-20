import api from './index'
import { axios } from '@/utils/request'

export function getDonateList (parameter) {
  return axios({
    url: api.donate + '/list',
    method: 'get',
    params: parameter
  })
}
