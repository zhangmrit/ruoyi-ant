<template>
  <a-form @submit="handleSubmit" :form="form" class="form">
    <a-row class="form-row" :gutter="24">
      <a-col :lg="{span: 6, offset: 6}" :md="12" :sm="24">
        <a-form-item >
          <span slot="label">生成模板
            <a-tooltip title="树表没有分页,数据展示为树形表格">
              <a-icon type="question-circle-o" />
            </a-tooltip>
          </span>
          <a-select
            v-decorator="['tplCategory', {initialValue:'crud',rules: [{ required: true, message: '请选择生成模板' }]}]"
            @change="tplChange">
            <a-select-option value="crud">单表（增删改查）</a-select-option>
            <a-select-option value="tree">树表（增删改查）</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :lg="{span: 6, offset: 1}" :md="12" :sm="24">
        <a-form-item>
          <span slot="label">生成包路径
            <a-tooltip title="生成在哪个java包下，例如 com.ruoyi.system">
              <a-icon type="question-circle-o" />
            </a-tooltip>
          </span>
          <a-input
            placeholder="请输入"
            v-decorator="[
              'packageName',
              {rules: [{ required: true, message: '请输入表描述', whitespace: true}]}
            ]" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="24">
      <a-col :lg="{span: 6, offset: 6}" :md="12" :sm="24">
        <a-form-item>
          <span slot="label">生成模块名
            <a-tooltip title="可理解为子系统名，例如 system">
              <a-icon type="question-circle-o" />
            </a-tooltip>
          </span>
          <a-input
            placeholder="请输入生成模块名"
            v-decorator="[
              'moduleName',
              {rules: [{ required: true, message: '请输入生成模块名', whitespace: true}]}
            ]" />
        </a-form-item>
      </a-col>
      <a-col :lg="{span: 6, offset: 1}" :md="12" :sm="24">
        <a-form-item>
          <span slot="label">生成业务名
            <a-tooltip title="可理解为功能英文名，例如 user">
              <a-icon type="question-circle-o" />
            </a-tooltip>
          </span>
          <a-input
            placeholder="请输入"
            v-decorator="[
              'businessName',
              {rules: [{ required: true, message: '请输入生成业务名', whitespace: true}]}
            ]" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="24">
      <a-col :lg="{span: 6, offset: 6}" :md="12" :sm="24">
        <a-form-item>
          <span slot="label">生成功能名
            <a-tooltip title="用作类描述，例如 用户">
              <a-icon type="question-circle-o" />
            </a-tooltip>
          </span>
          <a-input
            placeholder="请输入"
            v-decorator="[
              'functionName',
              {rules: [{ required: true, message: '请输入生成功能名', whitespace: true}]}
            ]" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-card class="card" v-if="other" title="其他信息" :bordered="false">
      <a-row class="form-row" :gutter="24">
        <a-col :lg="{span: 6, offset: 6}" :md="12" :sm="24">
          <a-form-item>
            <span slot="label">树编码字段
              <a-tooltip title="树显示的编码字段名， 如：dept_id">
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </span>
            <a-select v-decorator="['treeCode', {initialValue:'',rules: [{ required: true, message: '请选择树编码字段' }]}]">
              <a-select-option value="">---请选择---</a-select-option>
              <a-select-option v-for="(c, index) in mdl.columns" :key="index" :value="c.columnName">{{ c.columnName+':'+c.columnComment }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :lg="{span: 6, offset: 1}" :md="12" :sm="24">
          <a-form-item>
            <span slot="label">树父编码字段
              <a-tooltip title="树显示的父编码字段名， 如：parent_Id">
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </span>
            <a-select v-decorator="['treeParentCode', {initialValue:'',rules: [{ required: true, message: '请选择树父编码字段' }]}]">
              <a-select-option value="">---请选择---</a-select-option>
              <a-select-option v-for="(c, index) in mdl.columns" :key="index" :value="c.columnName">{{ c.columnName+':'+c.columnComment }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="24">
        <a-col :lg="{span: 6, offset: 6}" :md="12" :sm="24">
          <a-form-item>
            <span slot="label">树名称字段
              <a-tooltip title="树节点的显示名称字段名， 如：dept_name">
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </span>
            <a-select v-decorator="['treeName', {initialValue:'',rules: [{ required: true, message: '请选择树名称字段' }]}]">
              <a-select-option value="">---请选择---</a-select-option>
              <a-select-option v-for="(c, index) in mdl.columns" :key="index" :value="c.columnName">{{ c.columnName+':'+c.columnComment }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>
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
      other: false,
      form: this.$form.createForm(this)
    }
  },
  created () {
    this.mdl = Object.assign(this.info)
    this.tplChange(this.mdl.tplCategory)
    this.$nextTick(() => {
      this.form.setFieldsValue(pick(this.mdl, 'packageName', 'tplCategory', 'moduleName', 'businessName', 'functionName', 'treeCode', 'treeParentCode', 'treeName'))
    })
  },
  methods: {
    tplChange (value) {
      this.other = value === 'tree'
    },
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
