import Vue from 'vue'
import store from '@/store/'
import {
  ACCESS_TOKEN,
  DEFAULT_COLOR,
  DEFAULT_THEME,
  DEFAULT_LAYOUT_MODE,
  DEFAULT_COLOR_WEAK,
  SIDEBAR_TYPE,
  DEFAULT_FIXED_HEADER,
  DEFAULT_FIXED_HEADER_HIDDEN,
  DEFAULT_FIXED_SIDEMENU,
  DEFAULT_CONTENT_WIDTH_TYPE,
  DEFAULT_MULTI_TAB,
  DEFAULT_MULTI_MENU, // 复合菜单新增
  MULTI_MENU_KEY // 复合菜单新增
} from '@/store/mutation-types'
import config from '@/config/defaultSettings'

export default function Initializer () {
  console.log(`API_URL: ${process.env.VUE_APP_API_BASE_URL}`)

  store.commit('SET_SIDEBAR_TYPE', Vue.ls.get(SIDEBAR_TYPE, true))
  store.commit('TOGGLE_THEME', Vue.ls.get(DEFAULT_THEME, config.navTheme))
  store.commit('TOGGLE_LAYOUT_MODE', Vue.ls.get(DEFAULT_LAYOUT_MODE, config.layout))
  store.commit('TOGGLE_FIXED_HEADER', Vue.ls.get(DEFAULT_FIXED_HEADER, config.fixedHeader))
  store.commit('TOGGLE_FIXED_SIDERBAR', Vue.ls.get(DEFAULT_FIXED_SIDEMENU, config.fixSiderbar))
  store.commit('TOGGLE_CONTENT_WIDTH', Vue.ls.get(DEFAULT_CONTENT_WIDTH_TYPE, config.contentWidth))
  store.commit('TOGGLE_FIXED_HEADER_HIDDEN', Vue.ls.get(DEFAULT_FIXED_HEADER_HIDDEN, config.autoHideHeader))
  store.commit('TOGGLE_WEAK', Vue.ls.get(DEFAULT_COLOR_WEAK, config.colorWeak))
  store.commit('TOGGLE_COLOR', Vue.ls.get(DEFAULT_COLOR, config.primaryColor))
  store.commit('TOGGLE_MULTI_TAB', Vue.ls.get(DEFAULT_MULTI_TAB, config.multiTab))
  store.commit('SET_TOKEN', Vue.ls.get(ACCESS_TOKEN))

  // 复合菜单新增 初始化侧栏顶栏复合菜单模式
  store.commit('TOGGLE_MULTI_MENU', Vue.ls.get(DEFAULT_MULTI_MENU, config.multiMenu)) // 是否开启复合菜单模式
  store.commit('SET_MENU_KEY', Vue.ls.get(MULTI_MENU_KEY, 'dashboard')) // 默认复合菜单key

  // last step
}
