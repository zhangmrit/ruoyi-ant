<template>
  <a-modal
    title="重置密码"
    style="top: 20px;"
    :width="400"
    centered
    v-model="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
  >
    <a-form :form="form">
      <a-form-item style="display:none">
        <a-input v-decorator="['userId']"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="用户名"
      >
        <a-input placeholder="用户名" disabled v-decorator="['loginName', {rules: [{ required: true, message: '请输入用户名' }]}]" />
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="新密码"
      >
        <a-input type="password" placeholder="新密码" v-decorator="['password', {rules: [{ required: true,min:6,max:16, message: '请输入6到16位密码' }]}]" />
      </a-form-item>

    </a-form>
  </a-modal>
</template>
<script>
import { resetPwd } from '@/api/system'
import pick from 'lodash.pick'
export default {
  name: 'UserPwdModal',
  components: {
  },
  data () {
    return {
      description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      confirmLoading: false,
      mdl: {},
      form: this.$form.createForm(this)
    }
  },
  beforeCreate () {
  },
  created () {
  },
  methods: {
    edit (record) {
      this.form.resetFields()
      this.mdl = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'userId', 'loginName'))
        // this.form.setFieldsValue({ ...record })
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          this.confirmLoading = true
          resetPwd(values).then(res => {
            if (res.code === 0) {
              this.$message.success(`${values.loginName}` + '重置密码成功')
              // this.$emit('ok')
              this.visible = false
            } else {
              this.$message.success(res.msg)
            }
          }).catch(() => {
            this.$message.error('系统错误，请稍后再试')
          }).finally(() => {
            this.confirmLoading = false
          })
        }
      })
    }
  },
  watch: {
    /*
      'selectedRows': function (selectedRows) {
        this.needTotalList = this.needTotalList.map(item => {
          return {
            ...item,
            total: selectedRows.reduce( (sum, val) => {
              return sum + val[item.dataIndex]
            }, 0)
          }
        })
      }
      */
  }
}
</script>
