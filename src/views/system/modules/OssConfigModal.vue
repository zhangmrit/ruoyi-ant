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
      <a-form-item
        label="服务商"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-radio-group v-decorator="['type']" @change="handleChange">
          <a-radio :value="1">七牛云</a-radio>
          <a-radio :value="2">阿里云</a-radio>
          <a-radio :value="3">腾讯云</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-show="service===1"
        label="域名"
      >
        <a-input placeholder="域名" v-decorator="['qiniuDomain', {rules: [{ required: false, message: '请输入域名' }]}]" />
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-show="service===1"
        label="路径前缀"
      >
        <a-input placeholder="路径前缀" v-decorator="['qiniuPrefix', {rules: [{ required: false, message: '请输入路径前缀' }]}]" />
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-show="service===1"
        label="AccessKey"
      >
        <a-input v-decorator="['qiniuAccessKey',{rules: [{ required: false, message: '请输入AccessKey' }]}]" placeholder="AccessKey"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-show="service===1"
        label="SecretKey"
      >
        <a-input v-decorator="['qiniuSecretKey',{rules: [{ required: false, message: '请输入SecretKey' }]}]" placeholder="SecretKey"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-show="service===1"
        label="空间名"
      >
        <a-input v-decorator="['qiniuBucketName',{rules: [{ required: false, message: '请输入空间名' }]}]" placeholder="空间名"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-show="service===2"
        label="域名"
      >
        <a-input v-decorator="['aliyunDomain',{rules: [{ required: false, message: '请输入域名' }]}]" placeholder="域名"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-show="service===2"
        label="路径前缀"
      >
        <a-input v-decorator="['aliyunPrefix',{rules: [{ required: false, message: '请输入路径前缀' }]}]" placeholder="路径前缀"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-show="service===2"
        label="EndPoint"
      >
        <a-input v-decorator="['aliyunEndPoint',{rules: [{ required: false, message: '请输入EndPoint' }]}]" placeholder="EndPoint"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-show="service===2"
        label="AccessKeyId"
      >
        <a-input v-decorator="['aliyunAccessKeyId',{rules: [{ required: false, message: '请输入AccessKeyId' }]}]" placeholder="AccessKeyId"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-show="service===2"
        label="AccessKeySecret"
      >
        <a-input v-decorator="['aliyunAccessKeySecret',{rules: [{ required: false, message: '请输入AccessKeySecret' }]}]" placeholder="AccessKeySecret"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-show="service===2"
        label="BucketName"
      >
        <a-input v-decorator="['aliyunBucketName',{rules: [{ required: false, message: '请输入BucketName' }]}]" placeholder="BucketName"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-show="service===3"
        label="域名"
      >
        <a-input v-decorator="['qcloudDomain',{rules: [{ required: false, message: '请输入域名' }]}]" placeholder="域名"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-show="service===3"
        label="路径前缀"
      >
        <a-input v-decorator="['qcloudPrefix',{rules: [{ required: false, message: '请输入路径前缀' }]}]" placeholder="路径前缀"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-show="service===3"
        label="腾讯云SecretId"
      >
        <a-input v-decorator="['qcloudSecretId',{rules: [{ required: false, message: '请输入腾讯云SecretId' }]}]" placeholder="腾讯云SecretId"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-show="service===3"
        label="腾讯云SecretKey"
      >
        <a-input v-decorator="['qcloudSecretKey',{rules: [{ required: false, message: '请输入腾讯云SecretKey' }]}]" placeholder="腾讯云SecretKey"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-show="service===3"
        label="腾讯云BucketName"
      >
        <a-input v-decorator="['qcloudBucketName',{rules: [{ required: false, message: '请输入BucketName' }]}]" placeholder="BucketName"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-show="service===3"
        label="Bucket所属地区"
      >
        <a-input v-decorator="['qcloudRegion']" placeholder="设置bucket所在的区域，最新sdk不再支持简写，请填写完整"/>
      </a-form-item>

    </a-form>
  </a-modal>
</template>
<script>
import { saveOssConfig, getOssConfig } from '@/api/system'
export default {
  name: 'OssConfigModal',
  components: {
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
      service: 0,
      form: this.$form.createForm(this)
    }
  },
  beforeCreate () {
  },
  created () {
  },
  methods: {
    config (record) {
      getOssConfig().then(res => {
        this.mdl = Object.assign(res)
        this.service = this.mdl.type
        this.visible = true
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...this.mdl })
        })
      })
    },
    handleChange (e) {
      this.service = e.target.value
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          this.confirmLoading = true
          saveOssConfig(values).then(res => {
            if (res.code === 0) {
              this.$message.success('保存成功')
              this.$emit('ok')
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
