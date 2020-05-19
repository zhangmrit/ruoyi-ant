<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-config-provider>
</template>

<script>
// import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
// 引用cdn还可以这么写
// import { locales } from 'ant-design-vue'
// const zhCN = locales.zh_CN
import { domTitle, setDocumentTitle } from '@/utils/domUtil'
import { i18nRender } from '@/locales'

export default {
  data () {
    return {
      locale () {
        const { title } = this.$route.meta
        title && (setDocumentTitle(`${i18nRender(title)} - ${domTitle}`))
        return this.$i18n.getLocaleMessage(this.$store.getters.lang).antLocale
      }
    }
  }
}
</script>
