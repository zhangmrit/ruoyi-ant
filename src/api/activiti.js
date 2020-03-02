import api from './index'
import { axios, pureAxios } from '@/utils/request'

export const routerMap = {
  'leave': 'leave',
  's-leave': 'leave',
  'purchase': 'purchase'
}

export const modalMap = {
  'leave': 'leavemodal',
  's-leave': 'leavemodal',
  'purchase': 'purchasemodal'
}

export const statusMap = {
  '1': '处理中',
  '2': '结束',
  '3': '撤销',
  '4': '中止'
}
export const resultMap = {
  '1': '处理中',
  '2': '通过',
  '3': '驳回',
  '4': '撤销',
  '5': '删除',
  '6': '中止'
}

export const deployByFileURL = api.process + '/deployByFile'

export function getModelList (parameter) {
  return axios({
    url: api.models + '/list',
    method: 'get',
    params: parameter
  })
}
export function delModel (parameter) {
  return axios({
    url: api.models + '/remove',
    method: 'post',
    params: parameter
  })
}
export function deploy (id) {
  return axios({
    url: api.models + '/deploy/' + `${id}`,
    method: 'post'
  })
}

export function getProfList (parameter) {
  return axios({
    url: api.prof + '/list',
    method: 'get',
    params: parameter
  })
}
export function getProfAllLatest (parameter) {
  return axios({
    url: api.prof + '/allLatest',
    method: 'get',
    params: parameter
  })
}

export function delProf (parameter) {
  return axios({
    url: api.prof + '/remove',
    method: 'post',
    params: parameter
  })
}

export function diagram (did) {
  return pureAxios({
    url: api.process + '/show?ext=.png&did=' + `${did}`,
    method: 'get',
    responseType: 'blob'
  })
}

export function modelXml (did) {
  return pureAxios({
    url: api.process + '/show?ext=.bpmn&did=' + `${did}`,
    method: 'get',
    responseType: 'blob'
  })
}

export function processState (processId, state) {
  return axios({
    url: api.process + '/update/' + `${processId}` + '/' + `${state}`,
    method: 'post'
  })
}

export function getProfInfRuns (parameter) {
  return axios({
    url: api.processIns + '/runs',
    method: 'get',
    params: parameter
  })
}
export function getProfInfFinished (parameter) {
  return axios({
    url: api.processIns + '/finished',
    method: 'get',
    params: parameter
  })
}

export function processInsState (procInstId, state) {
  return axios({
    url: api.processIns + '/update/' + `${procInstId}` + '/' + `${state}`,
    method: 'post'
  })
}
/**
 * 删除流程实例 撤销申请
 * @param {*} parameter
 */
export function delProcessIns (parameter) {
  return axios({
    url: api.processIns + '/remove',
    method: 'post',
    params: parameter
  })
}
export function delHiProcessIns (parameter) {
  return axios({
    url: api.processIns + '/remove/his',
    method: 'post',
    params: parameter
  })
}
// 我的申请（未删除）
export function getBusinessListMy (parameter) {
  return axios({
    url: api.business + '/list/my',
    method: 'get',
    params: parameter
  })
}

export function saveBusiness (parameter) {
  return axios({
    url: api.business + (parameter.id > 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function auditTask (parameter) {
  return axios({
    url: api.task + '/audit',
    method: 'post',
    data: parameter
  })
}
export function auditTaskBatch (parameter) {
  return axios({
    url: api.task + '/audit/batch',
    method: 'post',
    data: parameter
  })
}

export function delBusiness (parameter) {
  return axios({
    url: api.business + '/remove',
    method: 'post',
    params: parameter
  })
}

export function getLeaveByBusiness (key) {
  return axios({
    url: api.leave + '/biz/' + `${key}`,
    method: 'get'
  })
}
export function getPurchaseByBusiness (key) {
  return axios({
    url: api.purchase + '/biz/' + `${key}`,
    method: 'get'
  })
}

export function saveLeave (parameter) {
  return axios({
    url: api.leave + (parameter.id > 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 保存报销申请
 * @param {*} parameter
 */
export function savePurchase (parameter) {
  return axios({
    url: api.purchase + (parameter.id > 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delLeave (parameter) {
  return axios({
    url: api.leave + '/remove',
    method: 'post',
    params: parameter
  })
}

export function getTasking (parameter) {
  return axios({
    url: api.task + '/ing',
    method: 'get',
    params: parameter
  })
}

export function getTaskdone (parameter) {
  return axios({
    url: api.task + '/done',
    method: 'get',
    params: parameter
  })
}

export function delTaskLogic (parameter) {
  return axios({
    url: api.task + '/remove',
    method: 'post',
    params: parameter
  })
}

/**
 * 任务流转历史
 * @param {} parameter
 */
export function getTaskFlow (parameter) {
  return axios({
    url: api.task + '/flow',
    method: 'get',
    params: parameter
  })
}

/**
 * 获取高亮流程图
 * @param  procInstId 流程实例编号
 */
export function hightlightFlow (procInstId) {
  return pureAxios({
    url: api.process + '/highlightImg/' + `${procInstId}`,
    method: 'get',
    responseType: 'blob'
  })
}

/**
 * 获取流程节点列表
 * @param {String} proDefId 流程定义编号
 */
export function getNodeList (proDefId) {
  return axios({
    url: api.node + '/list/' + `${proDefId}`,
    method: 'get'
  })
}
export function getNodeInfo (nodeId) {
  return axios({
    url: api.node + '/get/' + `${nodeId}`,
    method: 'get'
  })
}
export function updateNodeInfo (parameter) {
  return axios({
    url: api.node + '/update',
    method: 'post',
    data: parameter
  })
}
