<template>
  <a-form @submit="handleSubmit" :form="form" class="form">
    <a-row class="form-row" :gutter="24">
      <a-col :lg="{span: 6, offset: 6}" :md="12" :sm="24">
        <a-form-item label="表名称">
          <a-input
            placeholder="请输入仓库名称"
            v-decorator="[
              'tableName',
              {rules: [{ required: true, message: '请输入表名称', whitespace: true}]}
            ]" />
        </a-form-item>
      </a-col>
      <a-col :lg="{span: 6, offset: 1}" :md="12" :sm="24">
        <a-form-item
          label="表描述">
          <a-input
            placeholder="请输入"
            v-decorator="[
              'tableComment',
              {rules: [{ required: true, message: '请输入表描述', whitespace: true}]}
            ]" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="24">
      <a-col :lg="{span: 6, offset: 6}" :md="12" :sm="24">
        <a-form-item
          label="实体类名称">
          <a-input
            placeholder="请输入"
            v-decorator="[
              'className',
              {rules: [{ required: true, message: '请输入实体类名称', whitespace: true}]}
            ]" />
        </a-form-item>
      </a-col>
      <a-col :lg="{span: 6, offset: 1}" :md="12" :sm="24">
        <a-form-item
          label="作者">
          <a-input
            placeholder="请输入"
            v-decorator="[
              'functionAuthor',
              {rules: [{ required: true, message: '请输入作者', whitespace: true}]}
            ]" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="24">
      <a-col :lg="{span: 13, offset: 6}" :md="12" :sm="24">
        <a-form-item label="备注">
          <a-textarea :rows="3" v-decorator="['remark']"/>
        </a-form-item>
      </a-col>
    </a-row>
    <a-form-item v-if="showSubmit">
      <a-button htmlType="submit" >Submit</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import pick from 'lodash.pick'
export default {
  name: 'BasicInfoForm',
  props: {
    showSubmit: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      mdl: {},
      form: this.$form.createForm(this)
    }
  },
  created () {
    this.mdl = Object.assign(this.info)
    // console.log(this.mdl)
    this.$nextTick(() => {
      this.form.setFieldsValue(pick(this.mdl, 'tableName', 'tableComment', 'className', 'functionAuthor', 'remark'))
    })
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$notification['error']({
            message: 'Received values of form:',
            description: values
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
