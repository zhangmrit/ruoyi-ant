<template>
  <a-modal
    title="操作"
    style="top: 20px;"
    :width="800"
    :footer="null"
    v-model="visible"
  >
    <a-card :bordered="false">
      <detail-list size="small" :col="2" >
        <detail-list-item term="操作模块" >{{ mdl.title }}/{{ mdl.operType }}</detail-list-item>
        <detail-list-item term="请求方式">{{ mdl.requestMethod }}</detail-list-item>
      </detail-list>
      <detail-list title="" size="small" :col="1">
        <detail-list-item term="登陆信息">{{ mdl.operName }}/{{ mdl.operIp }}/{{ mdl.operLocation }}</detail-list-item>
      </detail-list>
      <detail-list title="" size="small" :col="1">
        <detail-list-item term="操作方法">{{ mdl.method }}</detail-list-item>
      </detail-list>
      <detail-list size="small" :col="2" >
        <detail-list-item term="请求地址">{{ mdl.operUrl }}</detail-list-item>
        <detail-list-item term="状态">{{ mdl.status===0?'成功':'失败' }}</detail-list-item>
      </detail-list>
      <a-divider style="margin-bottom: 32px"/>
      <detail-list title="参数" size="small" >
        <a-textarea :rows="15" v-model="mdl.operParam" disabled style="color:#000"/>
      </detail-list>
      <a-divider style="margin-bottom: 32px"/>
    </a-card>
  </a-modal>
</template>

<script>
import DetailList from '@/components/tools/DetailList'
const DetailListItem = DetailList.Item

export default {
  name: 'OperLogModal',
  components: {
    DetailList,
    DetailListItem
  },
  props: {
    operTypeMap: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      visible: false,
      mdl: {}
    }
  },
  created () {
  },
  methods: {
    detail (record) {
      this.mdl = Object.assign({}, record)
      this.mdl.operType = this.operTypeMap[this.mdl.businessType].text
      this.visible = true
    }
  }
}
</script>

<style scoped>

</style>
