<template>
  <a-modal
    title="操作"
    style="top: 20px;"
    :width="800"
    :footer="null"
    v-model="visible"
  >
    <icon-selector @change="handleIconChange"/>
  </a-modal>
</template>

<script>
import IconSelector from '@/components/IconSelector'

export default {
  name: 'IconSelectorView',
  components: {
    IconSelector
  },
  data () {
    return {
      visible: false
    }
  },
  methods: {
    show () {
      this.visible = true
    },
    handleIconChange (icon) {
      // console.log('change Icon', icon)
      this.visible = false
      this.$emit('ok', icon)
      // this.$message.info(<span>选中图标 <code>{icon}</code></span>)
    }
  }
}
</script>
