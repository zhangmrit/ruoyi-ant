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
        <a-input v-decorator="['deptId']"/>
      </a-form-item>

      <a-form-item
        :labelCol="
          labelCol"
        :wrapperCol="wrapperCol"
        label="上级部门"
      >
        <a-tree-select
          v-decorator="['parentId', {initialValue:'0',rules: [{ required: true, message: '请选择上级部门' }]}]"
          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="depts"
          placeholder="上级部门"
          treeDefaultExpandAll
        >
        </a-tree-select>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="部门名称"
      >
        <a-input
          v-decorator="['deptName',{rules: [{ required: true, message: '请输入部门名称' }]}]"
          placeholder="起一个名字"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="显示顺序"
      >
        <a-input
          v-decorator="['orderNum',{rules: [{ required: true, message: '请输入显示顺序' }]}]"
          placeholder="显示顺序"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="负责人"
      >
        <a-input
          v-decorator="['leader',{rules: [{ required: true, message: '请输入负责人' }]}]"
          placeholder="负责人"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="电话"
      >
        <a-input
          v-decorator="['phone',{rules: [{ required: true, message: '请输入电话' }]}]"
          placeholder="电话"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="邮箱"
      >
        <a-input
          v-decorator="['email',{rules: [{ required: true, message: '请输入邮箱' }]}]"
          placeholder="邮箱"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="状态"
      >
        <a-select v-decorator="['status', {rules: [{ required: true, message: '请选择状态' }]}]">
          <a-select-option :value="'0'">正常</a-select-option>
          <a-select-option :value="'1'">停用</a-select-option>
        </a-select>
      </a-form-item>

    </a-form>
  </a-modal>
</template>
<script>
import { getDeptList, saveDept } from '@/api/system'
import pick from 'lodash.pick'
export default {
  name: 'DeptModal',
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
      depts: [{ key: '0', value: '0', title: '无' }],
      mdl: {},
      confirmLoading: false,
      form: this.$form.createForm(this)
    }
  },
  beforeCreate () {
  },
  created () {
    getDeptList().then(res => {
      this.buildtree(res.rows, this.depts, 0)
    })
  },
  methods: {
    add (parentId) {
      this.form.resetFields()
      this.edit({ parentId: parentId || 0 })
    },
    edit (record) {
      this.mdl = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.mdl.parentId += ''
        this.form.setFieldsValue(pick(this.mdl, 'deptId', 'parentId', 'leader', 'phone', 'status', 'email', 'orderNum', 'deptName'))
        // this.form.setFieldsValue({ ...record })
      })
    },
    buildtree (list, arr, parentId) {
      list.forEach(item => {
        if (item.parentId === parentId) {
          var child = {
            key: item.deptId,
            value: item.deptId + '',
            title: item.deptName,
            children: []
          }
          this.buildtree(list, child.children, item.deptId)
          arr.push(child)
        }
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          this.$emit('ok')
          this.visible = false
          this.confirmLoading = true
          saveDept(values).then(res => {
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
