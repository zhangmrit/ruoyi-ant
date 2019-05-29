import { axios } from '@/utils/request'

const api = {
  user: '/system/user',
  role: '/system/role',
  service: '/service',
  permission: '/system/menu',
  orgTree: '/org/tree',
  dept: '/system/dept'
}

export default api

export function getUserList (parameter) {
  return axios({
    url: api.user + '/list',
    method: 'get',
    params: parameter
  })
}

export function getRoleList (parameter) {
  return axios({
    url: api.role + '/list',
    method: 'get',
    params: parameter
  })
}
export function getRoleAll () {
  return axios({
    url: api.role + '/all',
    method: 'get'
  })
}

export function getServiceList (parameter) {
  return axios({
    url: api.service,
    method: 'get',
    params: parameter
  })
}

export function getPermissionAll (parameter) {
  return axios({
    url: api.permission + '/all',
    method: 'get',
    params: parameter
  })
}
export function getPermissions (parameter) {
  return axios({
    url: api.permission + '/list',
    method: 'get',
    params: parameter
  })
}
export function getDeptList (parameter) {
  return axios({
    url: api.dept + '/list',
    method: 'get',
    params: parameter
  })
}

export function getOrgTree (parameter) {
  return axios({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService (parameter) {
  return axios({
    url: api.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}
