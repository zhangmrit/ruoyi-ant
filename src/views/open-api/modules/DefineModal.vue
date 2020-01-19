/* eslint-disable no-undef */
<template>
  <a-card :bordered="false">
    <a-form :form="form">
      <a-form-item style="display:none">
        <a-input v-decorator="['id']"/>
      </a-form-item>
      <a-tabs defaultActiveKey="1" type="card">
        <a-tab-pane tab="基本信息" key="1">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="接口编码">
            <a-input placeholder="接口编码" v-decorator="['key']"/>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="访问地址">
            <a-input placeholder="访问地址" v-decorator="['url']" disabled="true" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="接口名称">
            <a-input placeholder="接口名称" v-decorator="['name']" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="接口分类">
            <a-input placeholder="接口分类" v-decorator="['category']"/>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="接口描述">
            <a-textarea
              placeholder="接口描述"
              v-decorator="['remarks']"
              :autosize="{ minRows: 2, maxRows: 6 }"
            />
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane tab="脚本内容" key="2">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="脚本内容">
            <a-textarea
              placeholder="请输入脚本内容"
              v-decorator="['script']"
              :autosize="{ minRows: 10, maxRows: 30 }"
            />
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane tab="请求参数" key="3">
          <define_parm_list :apiId="apiId"/>
        </a-tab-pane>
        <a-tab-pane tab="返回参数" key="4">
          <define_result_list :apiId="apiId" />
        </a-tab-pane>
      </a-tabs>
    </a-form>
  </a-card>
</template>
<script>
import DefineParmList from '../DefineParmList.vue'
import DefineResultList from '../DefineResultList.vue'
import { saveDefine, getDefine } from '@/api/open-api/define'
import pick from 'lodash.pick'
export default {
  name: 'DefineModal',
  components: {
    'define_parm_list': DefineParmList,
    'define_result_list': DefineResultList
  },
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
      parmListData: [],
      form: this.$form.createForm(this),
      apiId: {
        type: String,
        default: null
      }
    }
  },
  beforeCreate () {
    this.apiId = this.$route.query.apiId
    console.log(this.apiId)
    if (this.apiId) {
      getDefine(this.apiId).then(res => {
        this.mdl = Object.assign(res)
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.mdl, 'id', 'key', 'url', 'name', 'category', 'dataSourceId', 'script', 'scriptType', 'resultType', 'httpMethod', 'status', 'createTime', 'updateTime', 'remarks', 'delFlag'))
        })
      })
    }
  },
  created () {
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
        this.form.setFieldsValue(pick(this.mdl, 'id', 'key', 'url', 'name', 'category', 'dataSourceId', 'script', 'scriptType', 'resultType', 'httpMethod', 'status', 'createTime', 'updateTime', 'remarks', 'delFlag'))
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          saveDefine(values).then(res => {
            if (res.code === 0) {
              this.$message.success('保存成功')
              this.$emit('ok')
              this.visible = false
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
