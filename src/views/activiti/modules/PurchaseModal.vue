<template>
  <a-modal
    title="操作"
    style="top: 20px;"
    :width="800"
    v-model="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    :footer="null"
  >

    <a-form :form="form">

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="标题"
      >
        <span class="spanClass">{{ mdl.title }}</span>
      </a-form-item>

      <a-form-item
        label="描述"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-textarea
          disabled
          v-model="mdl.description"
          :autosize="{ minRows: 2, maxRows: 6 }"
        />
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="金额"
      >
        <span>{{ mdl.money }} 元</span>
      </a-form-item>

      <a-form-item
        label="审批意见"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-show="audit"
      >
        <a-textarea
          :autosize="{ minRows: 2, maxRows: 6 }"
          v-model="formData.comment"
        />
      </a-form-item>

      <a-form-item
        :wrapperCol="{ span: 24 }"
        style="text-align: center"
        v-show="audit"
      >
        <a-button type="primary" :loading="confirmLoading" @click="handleSubmit(2)">同意</a-button>
        <a-button style="margin-left: 8px" @click="handleSubmit(3)">驳回</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { getPurchaseByBusiness, auditTask } from '@/api/activiti'
export default {
  name: 'LeaveModal',
  props: {
    audit: {
      type: Boolean,
      default: true
    }
  },
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
      options: [],
      dateFormat: 'YYYY-MM-DD HH:mm',
      formData: {},
      form: this.$form.createForm(this)
    }
  },
  beforeCreate () {
  },
  created () {
  },
  methods: {
    show (record) {
      // record 是任务 如果只是查看可以只传入一个businessKey
      if (this.audit) {
        this.formData = Object.assign(
          {
            taskId: record.id,
            procInstId: record.procInstId,
            procName: record.processDefName,
            businessKey: record.businessKey,
            procDefKey: record.processDefKey,
            applyer: record.applyer
          }
        )
      }
      getPurchaseByBusiness(record.businessKey).then(res => {
        if (res.code === 0) {
          this.mdl = Object.assign(res.data)
          this.visible = true
        }
      })
    },
    handleSubmit (result) {
      this.confirmLoading = true
      const formData = this.formData
      formData.result = result
      auditTask(formData).then(res => {
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
<style lang="less" scoped>
/deep/ .ant-input-disabled{
    color: #000;
    background-color: #fff;
}
/deep/ .ant-select-disabled{
    color: #000;
}
/deep/ .ant-select-selection{
    background-color: #fff;
}
</style>
