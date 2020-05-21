<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <a href="https://www.github.com/vueComponent/pro-layout" target="_blank">Pro Layout</a>
      <a href="https://www.github.com/vueComponent/ant-design-vue-pro" target="_blank">Pro Github</a>
      <a href="https://gitee.com/zhangmrit/ruoyi-cloud">RuoYi Cloud</a>
      <a href="https://gitee.com/zhangmrit/ruoyi-ant">RuoYi Ant</a>
    </template>
    <template v-slot:copyright>
      <a href="https://gitee.com/zhangmrit" target="_blank">wind</a>
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  }
}
</script>
