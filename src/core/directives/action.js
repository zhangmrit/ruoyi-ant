import Vue from 'vue'
import store from '@/store'

/**
 * has 权限指令
 * 指令用法：参看shiro
 *    <a-button v-has="'user:add'" >添加用户</a-button>
 *    <a-button v-has="'user:edit'">删除用户</a-button>
 *    <a v-has="'user:del'" @click="edit(record)">修改</a>
 */
const has = Vue.directive('has', {
  bind: function (el, binding, vnode) {
    if (!Vue.prototype.$_has(binding.value)) {
      el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
    }
  }
})
// 权限检查方法
Vue.prototype.$_has = function (value) {
  // 获取用户按钮权限
  let isExist = false
  const dynamicButtons = store.getters.buttons
  if (dynamicButtons === undefined || dynamicButtons === null || dynamicButtons.length < 1) {
    return isExist
  }
  dynamicButtons.forEach(button => {
    if (button === value) {
      isExist = true
      return isExist
    }
  })
  // return isExist
  return true
}
export default has
