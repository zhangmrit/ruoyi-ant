<template>
  <a-card :bordered="false">
    <component @onEdit="handleEdit" @onGoBack="handleGoBack" :record="record" :is="currentComponet"></component>
  </a-card>
</template>

<script>

// 动态切换组件
import List from '@/views/list/table/List'
import Edit from '@/views/list/table/Edit'

export default {
  name: 'TableListWrapper',
  components: {
    List,
    Edit
  },
  data () {
    return {
      currentComponet: 'List',
      record: ''
    }
  },
  created () {

  },
  methods: {
    handleEdit (record) {
      this.record = record || ''
      this.currentComponet = 'Edit'
      console.log(record)
    },
    handleGoBack () {
      this.record = ''
      this.currentComponet = 'List'
    }
  },
  watch: {
    '$route.path' () {
      this.record = ''
      this.currentComponet = 'List'
    }
  }
}
</script>
