<template>
  <a-modal
    title="操作"
    style="top: 20px;"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :form="form">

      <a-form-item style="display:none">
        <a-input v-decorator="['roleId']"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="角色名称"
      >
        <a-input
          v-decorator="[
            'roleName',
            {
              rules: [{ required: true, message: '请输入角色名称' }]
            }
          ]"
          disabled="true"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="权限字符"
      >
        <a-input
          v-decorator="['roleKey',{rules: [{ required: true, message: '请输入权限字符' }]}]"
          disabled="true"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="数据权限"
        extra="特殊情况下，设置为“自定数据权限”"
      >
        <a-select v-decorator="['dataScope', {initialValue:'1'}]" @change="scopeChange">
          <a-select-option :value="'1'">全部数据权限</a-select-option>
          <a-select-option :value="'2'">自定义数据权限</a-select-option>
          <a-select-option :value="'3'">本部门数据权限</a-select-option>
          <a-select-option :value="'4'">本部门及以下数据权限</a-select-option>
          <a-select-option :value="'5'">仅本人数据权限</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="拥有权限"
        v-show="dataScope"
      >

        <a-tree
          checkable
          :autoExpandParent="autoExpandParent"
          v-if="deptTree.length>0"
          v-model="checkedKeys"
          :treeData="deptTree"
        >
        </a-tree>
      </a-form-item>
    </a-form>

  </a-modal>
</template>

<script>
import { authDataScope, getRoleDeptIds, getDeptList } from '@/api/system'
import pick from 'lodash.pick'

export default {
  name: 'RoleModal',
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      visible: false,
      confirmLoading: false,
      mdl: {},

      form: this.$form.createForm(this),
      deptTree: [],
      // 是否显示部门树
      dataScope: false,
      autoExpandParent: true,
      checkedKeys: []
    }
  },
  created () {
    getDeptList().then(res => {
      this.buildtree(res.rows, this.deptTree, 0)
    })
  },
  methods: {
    add () {
      this.form.resetFields()
      this.edit({ })
    },
    edit (record) {
      getRoleDeptIds(record.roleId).then(res => { this.checkedKeys = res || [] })
      this.mdl = Object.assign({}, record)
      this.dataScope = this.mdl.dataScope === '2'
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'roleId', 'roleName', 'roleKey', 'dataScope'))
        // this.form.setFieldsValue(...record)
      })
    },
    close () {
      this.$emit('close')
      this.visible = false
    },
    buildtree (list, arr, parentId) {
      list.forEach(item => {
        if (item.parentId === parentId) {
          var child = {
            key: item.deptId + '',
            value: item.deptId + '',
            title: item.deptName,
            children: []
          }
          this.buildtree(list, child.children, item.deptId)
          if (child.children.length === 0) { delete child.children }
          arr.push(child)
        }
      })
    },
    scopeChange (value) {
      this.dataScope = value === '2'
    },
    handleOk (e) {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          console.log(this.checkedKeys)

          values.deptIds = this.dataScope ? this.checkedKeys : []
          _this.confirmLoading = true
          authDataScope(Object.assign(values)).then(res => {
            console.log(res)
            if (res.code === 0) {
              _this.$message.success('保存成功')
              _this.$emit('ok')
              _this.visible = false
            } else {
              _this.$message.success(res.msg)
            }
          }).catch(() => {
            _this.$message.error('系统错误，请稍后再试')
          }).finally(() => {
            _this.confirmLoading = false
          })
        }
      })
    },
    handleCancel () {
      this.visible = false
    }

  }
}
</script>

<style scoped>

</style>
