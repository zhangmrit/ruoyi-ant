<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-locale-provider>
</template>

<script>
// import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { locales } from 'ant-design-vue'
import { AppDeviceEnquire } from '@/utils/mixin'

const zhCN = locales.zh_CN

export default {
  mixins: [AppDeviceEnquire],
  data () {
    return {
      locale: zhCN
    }
  },
  mounted () {

  }
}
</script>
<style>
  #app {
    height: 100%;
  }
</style>
