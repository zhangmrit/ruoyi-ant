import Vue from 'vue'
import {
  MULTI_MENU_KEY,
  MULTI_MENU_MAP
} from '@/store/mutation-types'

const menu = {
  state: {
    menuKey: '',
    menuMap: new Map()
  },
  mutations: {
    SET_MENU_KEY: (state, key) => {
      state.menuKey = key
      // console.log('menu.mutations.SET_MENU_KEY', state.menuKey)
    },
    SET_MENU_MAP: (state, menus) => {
      state.menuMap = menus
      // console.log('menu.mutations.SET_MENU_LIST', state.menuList)
    }
  },
  actions: {
    setMenuKey ({ commit }, key) {
      // console.log('menu.actions.setMenuKey', key)
      Vue.ls.set(MULTI_MENU_KEY, key)
      commit('SET_MENU_KEY', key)
    },
    setMenuMap ({ commit }, menus) {
      // console.log('menu.actions.setMenuList', menus)
      Vue.ls.set(MULTI_MENU_MAP, menus)
      commit('SET_MENU_MAP', menus)
    }

  }
}

export default menu
