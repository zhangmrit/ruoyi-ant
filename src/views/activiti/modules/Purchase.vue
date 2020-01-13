<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        label="标题"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'title',
            {rules: [{ required: true, message: '请输入标题' }]}
          ]"
          placeholder="请假标题" />
      </a-form-item>
      <a-form-item
        label="金额"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">

        <a-input
          style="width: 150px;"
          addonAfter="元"
          v-decorator="[
            'money',
            {rules: [
              {required: true, message: '请输入金额' },
              {validator: validateMoney}
            ]}
          ]"
          placeholder="金额"
        />
      </a-form-item>
      <a-form-item
        label="描述"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-textarea
          rows="4"
          placeholder="请输入描述"
          v-decorator="[
            'description',
            {rules: [{ required: true, message: '请输入描述' }]}
          ]" />
      </a-form-item>
      <a-form-item
        :wrapperCol="{ span: 24 }"
        style="text-align: center"
      >
        <a-button htmlType="submit" type="primary" :loading="confirmLoading">提交</a-button>
        <router-link :to="{name:'businessList'}"><a-button style="margin-left: 8px">返回</a-button></router-link>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import { savePurchase } from '@/api/activiti'
import pick from 'lodash.pick'
export default {
  name: 'LeaveForm',
  data () {
    return {
      labelCol: {
        lg: { span: 7 }, sm: { span: 7 }
      },
      wrapperCol: {
        lg: { span: 10 }, sm: { span: 17 }
      },
      confirmLoading: false,
      leaveTypes: [],
      formData: {},
      // form
      form: this.$form.createForm(this)

    }
  },
  async created () {
    const query = this.$route.query
    this.formData = Object.assign(pick(query, 'key', 'procDefId', 'procName'))
  },
  methods: {
    validateMoney (rule, value, callback) {
      if (value > 0) {
        callback()
      } else {
        callback(new Error('金额必须大于0'))
      }
    },
    // handler
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          values = Object.assign(values, this.formData)
          // eslint-disable-next-line no-console
          console.log('Received values of form: ', values)
          this.confirmLoading = true
          savePurchase(values).then(res => {
            if (res.code === 0) {
              this.$message.success('保存成功')
              this.$router.push({ name: 'businessList' })
            } else {
              this.$message.error(res.msg)
            }
          }).catch(() => {
            this.$message.error('系统错误，请稍后再试')
          }).finally(() => {
            this.confirmLoading = false
          })
        }
      })
    }
  }
}
</script>
