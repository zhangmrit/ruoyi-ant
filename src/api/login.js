import api from './index'
import { axios, pureAxios } from '@/utils/request'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return axios({
    url: '/auth/login/slide',
    method: 'post',
    data: parameter
  })
}

export function getSmsCaptcha (parameter) {
  return axios({
    url: api.SendSms,
    method: 'post',
    data: parameter
  })
}

export function getInfo () {
  return axios({
    url: '/system/user/info',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function logout (token) {
  return axios({
    url: '/auth/logout',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'token': token
    }
  })
}

export function imgcode () {
  return pureAxios({
    url: '/code',
    method: 'get',
    responseType: 'blob'
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step (parameter) {
  return axios({
    url: api.twoStepCode,
    method: 'post',
    data: parameter
  })
}

// 获取验证图片  以及token
export function getCaptcha (data) {
  return axios({
    url: '/auth/captcha/get',
    method: 'post',
    data
  })
}

// 滑动或者点选验证
export function captchaCheck (data) {
  return axios({
    url: '/auth/captcha/check',
    method: 'post',
    data
  })
}
