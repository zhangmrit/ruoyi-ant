import Vue from 'vue'
import { checkPermission } from '@/utils/permissions'

/**
 * has 权限指令
 * 指令用法：参看shiro
 *    <a-button v-has="'user:add'" >添加用户</a-button>
 *    <a-button v-has="'user:edit'">删除用户</a-button>
 *    <a v-has="'user:del'" @click="edit(record)">修改</a>
 */
const has = Vue.directive('has', {
  bind: function (el, binding, vnode) {
    if (!checkPermission(binding.value)) {
      el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
    }
  }
})
export default has
