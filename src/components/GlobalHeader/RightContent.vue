<template>
  <div :class="wrpCls">
    <a href="http://doc.rycloud.zmrit.com/#/quick-start" target="_blank" :class="actionClassName">
      <a-icon type="question-circle-o"></a-icon>
    </a>
    <select-lang :class="actionClassName" />
    <avatar-dropdown :menu="showMenu" :current-user="currentUser" :class="actionClassName" />
  </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown'
import SelectLang from '@/components/SelectLang'

export default {
  name: 'RightContent',
  components: {
    AvatarDropdown,
    SelectLang
  },
  props: {
    topMenu: {
      type: Boolean,
      required: true
    },
    theme: {
      type: String,
      required: true
    }
  },
  data () {
    this.actionClassName = 'ant-pro-global-header-index-action'
    return {
      showMenu: true,
      currentUser: {}
    }
  },
  computed: {
    wrpCls () {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${this.topMenu && this.theme || 'light'}`]: true
      }
    }
  },
  mounted () {
    setTimeout(() => {
      this.currentUser = {
        name: '若依'
      }
    }, 1500)
  }
}
</script>
