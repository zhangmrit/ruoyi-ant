import { axios } from '@/utils/request'

const api = {
  user: '/system/user',
  role: '/system/role',
  permission: '/system/menu',
  dept: '/system/dept'
}

export default api

// user
export function getUserList (parameter) {
  return axios({
    url: api.user + '/list',
    method: 'get',
    params: parameter
  })
}
export function saveUser (parameter) {
  return axios({
    url: api.user + (parameter.userId > 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function delUser (parameter) {
  return axios({
    url: api.user + '/remove',
    method: 'post',
    params: parameter
  })
}
export function changUserStatus (parameter) {
  return axios({
    url: api.user + '/status',
    method: 'post',
    data: parameter
  })
}

// role
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

export function saveRole (parameter) {
  return axios({
    url: api.role + (parameter.roleId > 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delRole (parameter) {
  return axios({
    url: api.role + '/remove',
    method: 'post',
    params: parameter
  })
}
export function changRoleStatus (parameter) {
  return axios({
    url: api.role + '/status',
    method: 'post',
    data: parameter
  })
}

// menu
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
export function getRolePermIds (parameter) {
  return axios({
    url: api.permission + '/role',
    method: 'get',
    params: parameter
  })
}

// dept
export function getDeptList (parameter) {
  return axios({
    url: api.dept + '/list',
    method: 'get',
    params: parameter
  })
}
