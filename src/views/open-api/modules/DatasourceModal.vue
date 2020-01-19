<template>
  <a-modal
    title="操作"
    style="top: 20px;"
    :width="800"
    v-model="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
  >
    <a-form :form="form">
      <a-form-item style="display:none">
        <a-input v-decorator="['id']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="数据库名称">
        <a-input placeholder="数据库名称" v-decorator="['name']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用户名">
        <a-input placeholder="数据库连接用户名" v-decorator="['username']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="密码">
        <a-input placeholder="数据库连接用户密码" v-decorator="['password']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="JDBC驱动">
        <a-select v-decorator="['driverClassName', {initialValue:'1',rules: [{ required: true, message: '请选择JDBC驱动' }]}]">
          <a-select-option v-for="(d, index) in driverClassNames" :key="index" :value="d.dictValue">{{ d.dictLabel }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注信息">
        <a-textarea
          placeholder="备注信息"
          v-decorator="['remarks']"
          :autosize="{ minRows: 2, maxRows: 6 }"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { getDictArray } from '@/utils/dict'
import { saveDatasource } from '@/api/open-api/datasource'
import pick from 'lodash.pick'
export default {
  name: 'DatasourceModal',
  props: {},
  components: {},
  data () {
    return {
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
      driverClassNames: [],
      form: this.$form.createForm(this)
    }
  },
  beforeCreate () {},
  async created () {
    this.driverClassNames = await getDictArray('datasource_driver_class_name')
  },
  methods: {
    add () {
      this.form.resetFields()
      this.edit({ id: 0 })
    },
    edit (record) {
      this.mdl = Object.assign(record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(this.mdl, 'id', 'name', 'url', 'username', 'password', 'driverClassName', 'remarks')
        )
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          this.confirmLoading = true
          saveDatasource(values)
            .then(res => {
              if (res.code === 0) {
                this.$message.success('保存成功')
                this.$emit('ok')
                this.visible = false
              } else {
                this.$message.error(res.msg)
              }
            })
            .catch(() => {
              this.$message.error('系统错误，请稍后再试')
            })
            .finally(() => {
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
