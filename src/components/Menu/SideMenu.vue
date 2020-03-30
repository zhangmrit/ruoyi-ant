<template>
  <a-layout-sider
    :class="['sider', isDesktop() ? null : 'shadow', theme, fixSiderbar ? 'ant-fixed-sidemenu' : null ]"
    width="256px"
    :collapsible="collapsible"
    v-model="collapsed"
    :trigger="null">
    <logo />
    <s-menu
      :collapsed="collapsed"
      :menu="currentMenus"
      :theme="theme"
      :mode="mode"
      @select="onSelect"
      style="padding: 16px 0px;"></s-menu>
  </a-layout-sider>

</template>

<script>
import Logo from '@/components/tools/Logo'
import SMenu from './index'
import { mixin, mixinDevice } from '@/utils/mixin'
import { mapState } from 'vuex'

export default {
  name: 'SideMenu',
  components: { Logo, SMenu },
  mixins: [mixin, mixinDevice],
  props: {
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    collapsible: {
      type: Boolean,
      required: false,
      default: false
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    menus: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      currentMenus: [] // 复合菜单新增
    }
  },
  computed: {
    ...mapState({ // 复合菜单新增
      menuKey: state => state.menu.menuKey,
      menuMap: state => state.menu.menuMap,
      menuGroup: state => state.app.menuGroup
    })
  },
  created () {
    this.genMenus(this.menuGroup, this.menuKey) // 复合菜单新增
  },
  methods: {
    onSelect (obj) {
      this.$emit('menuSelect', obj)
    },
    genMenus (menuGroup, key) { // 复合菜单新增
      if (menuGroup) {
        this.currentMenus = this.menuMap.get(key)
      } else {
        this.currentMenus = this.menus
      }
      // console.log(menuGroup, this.currentMenus)
      //   this.menus.forEach(item => {
      //   if (item.name === key) {
      //     this.currentMenus = item.children
      //   }
      // })
    }
  },
  watch: {
    menuKey: function (key) { // 复合菜单新增
      // console.log('^^^^^^', key)
      this.genMenus(this.menuGroup, key)
    },
    menuGroup: function (checked) { // 复合菜单新增
      this.genMenus(checked, this.menuKey)
    }
  }
}
</script>
