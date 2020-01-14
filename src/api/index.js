const api = {
  Login: '/auth/login',
  Logout: '/auth/logout',
  ForgePassword: '/auth/forge-password',
  Register: '/auth/register',
  twoStepCode: '/auth/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',
  // get my info
  UserInfo: '/user/info',
  // system
  user: '/system/user',
  role: '/system/role',
  permission: '/system/menu',
  dept: '/system/dept',
  dictType: '/system/dict/type',
  dictData: '/system/dict/data',
  dist: '/system/districts',
  config: '/system/config',
  oss: '/system/oss',
  donate: '/system/donate',
  models: '/act/models',
  prof: '/act/prof',
  process: '/act/process',
  processIns: '/act/process/ins',
  business: 'act/business',
  leave: 'act/leave',
  purchase: 'act/purchase',
  node: 'act/node',
  task: 'act/task'
}
export default api
