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
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="编号"
      >
        <a-input placeholder="编号" v-decorator="['id', {rules: [{ required: true, message: '请输入编号' }]}]" />
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="层级"
      >
        <a-select placeholder="层级" v-decorator="['deep', {initialValue:0,rules: [{ required: true, message: '请选择层级' }]}]">
          <a-select-option v-for="(d, index) in deeps" :key="index" :value="d.value">{{ d.label }}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="名称"
      >
        <a-input placeholder="名称" v-decorator="['name', {rules: [{ required: true, message: '请输入名称' }]}]" />
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="拼音"
      >
        <a-input v-decorator="['pinyin',{rules: [{ required: true, message: '请输入拼音' }]}]" placeholder="拼音"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="拼音缩写"
      >
        <a-input v-decorator="['pinyinShor',{rules: [{ required: true, message: '请输入拼音缩写' }]}]" placeholder="拼音缩写"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="扩展名"
      >
        <a-input v-decorator="['extName']" placeholder="扩展名"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="创建时间"
        v-if="mdl.createTime"
      >
        <span>{{ mdl.createTime }}</span>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="最后更新时间"
        v-if="mdl.updateTime"
      >
        <span>{{ mdl.updateTime }}</span>
      </a-form-item>
      <a-divider />
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="演示demo"
      >
        <a-cascader :options="options" :loadData="loadData" placeholder="Please select" v-model="city" changeOnSelect/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { saveDist, getDistList } from '@/api/system'
import pick from 'lodash.pick'
export default {
  name: 'DictModal',
  props: {
    deeps: {
      type: Array,
      required: true
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
      city: [],
      form: this.$form.createForm(this)
    }
  },
  beforeCreate () {
  },
  created () {
    getDistList(Object.assign({ deep: 0 })).then(res => {
      this.options = res.rows.map(d => {
        return { value: d.id, label: d.name, isLeaf: false }
      })
    })
  },
  methods: {
    add () {
      this.form.resetFields()
      this.edit({ dictId: 0 })
    },
    edit (record) {
      this.mdl = Object.assign(record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'id', 'deep', 'name', 'pinyin', 'pinyinShor', 'extName'))
      })
    },
    loadData (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true

      getDistList(Object.assign({ pid: targetOption.value })).then(res => {
        targetOption.loading = false
        targetOption.children = res.rows.map(d => {
          return { value: d.id, label: d.name, isLeaf: d.deep === 2 }
        })
        this.options = [...this.options]
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.$message.success('your select dist is ' + this.city)
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          this.confirmLoading = true
          saveDist(values).then(res => {
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
