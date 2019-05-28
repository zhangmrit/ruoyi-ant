<template>
  <a-modal
    title="操作"
    style="top: 20px;"
    :width="800"
    v-model="visible"
    @ok="handleSubmit"
  >
    <a-form :form="form">

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="用户名"
      >
        <a-input placeholder="用户名" v-decorator="['loginName']" id="no" disabled="disabled" />
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="昵称"
      >
        <a-input
          v-decorator="[
            'userName',
            {
              rules: [{ required: true, message: '请输入昵称' }]
            }
          ]"
          placeholder="起一个名字"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="状态"
      >
        <a-select v-decorator="['status', {rules: [{ required: true, message: '请选择状态' }]}]">
          <a-select-option :value="'0'">正常</a-select-option>
          <a-select-option :value="'1'">禁用</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="部门"
      >
        <a-tree-select
          v-decorator="['deptId', {rules: [{ required: true, message: '请选择部门' }]}]"
          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="deptTree"
          placeholder="部门"
          treeDefaultExpandAll
        >
        </a-tree-select>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="描述"
      >
        <a-textarea :rows="5" placeholder="..." v-decorator="['remark', {rules: [{ required: true }]}]"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="拥有角色"
        hasFeedback
      >
        <a-select
          style="width: 100%"
          mode="multiple"
          v-decorator="['roles', {rules: [{ required: true, message: '请选择角色' }]}]"
          :allowClear="true"
        >
          <a-select-option v-for="(action) in roleAll" :key="action.id" >{{ action.name }}</a-select-option>
        </a-select>
      </a-form-item>

    </a-form>
  </a-modal>
</template>
<script>
import { getRoleAll } from '@/api/manage'
import pick from 'lodash.pick'
export default {
  name: 'UserModal',
  props: {
    deptTree: {
      type: Array,
      required: true
    }
  },
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
      roleAll: [],
      mdl: {},
      form: this.$form.createForm(this)
    }
  },
  beforeCreate () {
  },
  created () {
    this.loadRoleAll()
  },
  methods: {
    add () {
      this.form.resetFields()
      this.edit({})
    },
    edit (record) {
      this.mdl = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.mdl.deptId += ''
        this.form.setFieldsValue(pick(this.mdl, 'loginName', 'userName', 'status', 'roles', 'remark', 'deptId'))
        // this.form.setFieldsValue({ ...record })
      })
    },
    loadRoleAll () {
      getRoleAll().then(res => {
        this.roleAll = res.rows
        console.log('roleALl', this.roleAll)
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          values.id = this.mdl.id
          console.log('Received values of form: ', values)
          this.visible = false
          this.$emit('ok')
          // this.$refs.table.refresh(true)
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
