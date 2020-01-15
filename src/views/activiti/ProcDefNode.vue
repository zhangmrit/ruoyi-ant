<template>
  <a-card :bordered="false">
    <a-row :gutter="8">
      <a-col :span="5">
        <!-- <a-tree
          v-if="nodes.length>0"
          :treeData="nodes"
          showIcon
          @select="handleSelect">
          <my-icon slot="0" type="icon-kaishi1" />
          <my-icon slot="1" type="icon-shen" />
          <my-icon slot="2" type="icon-jieshu" />
        </a-tree> -->
        <a-menu style="width: 256px" mode="vertical" @select="handleSelect">
          <a-menu-item v-for="node in nodes" :key="node.nodeId" :title="node.name" >
            <my-icon :type="node.icon" />
            {{ node.name }}
          </a-menu-item>
        </a-menu>
      </a-col>
      <a-col :span="12">
        <div class="table-page-search-wrapper">
          <a-form @submit="handleSubmit" :form="form">
            <a-form-item
              :wrapperCol="{ span: 22 }">
              <a-alert message="温馨提示：若流程运行至未分配审批人员的审批节点时，流程将自动中断取消" type="warning" showIcon />
            </a-form-item>
            <a-form-item v-show="false">
              <a-input v-decorator="['nodeId']"/>
            </a-form-item>
            <a-form-item v-show="false">
              <a-input v-decorator="['deptHeader']"/>
            </a-form-item>
            <a-form-item
              label="节点名称"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">
              <span>{{ mdl.name }}</span>
            </a-form-item>
            <a-form-item
              label="审批人"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">
              <a-checkbox @change="onChangeRole" :checked="roleChecked">角色</a-checkbox>
              <a-checkbox @change="onChangeDept" :checked="deptChecked">部门</a-checkbox>
              <a-checkbox @change="onChangeUser" :checked="userChecked">用户</a-checkbox>
              <a-checkbox @change="onChangeDeptHeader" :checked="deptHeader" >所属部门负责人</a-checkbox>
            </a-form-item>
            <a-form-item
              label="选择角色"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              v-show="roleChecked"
            >
              <!-- <a-select
                v-decorator="['roleIds', {rules: [{ required: roleChecked, message: '至少选择一个角色' }]}]"
                mode="multiple"
                allowClear
                placeholder="角色">
                <a-select-option v-for="(item, index) in roles" :key="index" :value="item.roleId">{{ item.roleName }}</a-select-option>
              </a-select> -->

              <a-select
                v-decorator="['roleIds', {rules: [{ required: roleChecked, message: '至少选择一个用户' }]}]"
                mode="multiple"
                allowClear
                placeholder="用户">
                <a-select-option v-for="(item, index) in roles" :key="index" :value="item.roleId">{{ item.roleName }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              label="选择部门"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              v-show="deptChecked"
            >
              <a-tree-select
                v-decorator="['deptIds', {rules: [{ required: deptChecked, message: '至少选择一个部门' }]}]"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                :treeData="depts"
                treeDefaultExpandAll
                @change="handleChangeDept"
                placeholder="部门"
                multiple
                allowClear
              >
              </a-tree-select>
            </a-form-item>
            <a-form-item
              label="选择用户"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              v-show="userChecked"
            >
              <a-select
                v-decorator="['userIds', {rules: [{ required: userChecked, message: '至少选择一个用户' }]}]"
                mode="multiple"
                allowClear
                placeholder="用户">
                <a-select-option v-for="(item, index) in users" :key="index" :value="item.userId">{{ item.userName+' - '+item.loginName }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              :wrapperCol="{ span: 24 }"
              style="text-align: center"
            >
              <a-button htmlType="submit" type="primary" :loading="confirmLoading" :disabled="mdl.type!==1">提交</a-button>
              <a-button style="margin-left: 8px" @click="toList">返回</a-button>
            </a-form-item>
          </a-form>
        </div>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import { Tree, Icon } from 'ant-design-vue'
import { STable } from '@/components'
import { getNodeList, getNodeInfo, updateNodeInfo } from '@/api/activiti'
import { getDeptList, getUserList, getRoleAll } from '@/api/system'
import pick from 'lodash.pick'
const MyIcon = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1574906_mvhehmkaer.js' // 在 iconfont.cn 上生成
})
export default {
  name: 'TableList',
  components: {
    Tree,
    STable,
    MyIcon
  },
  data () {
    return {
      visible: false,
      labelCol: {
        lg: { span: 3 }, sm: { span: 3 }
      },
      wrapperCol: {
        lg: { span: 20 }, sm: { span: 12 }
      },
      mdl: {},
      confirmLoading: false,
      form: this.$form.createForm(this),
      deptChecked: false,
      depts: [],
      userChecked: false,
      users: [],
      roleChecked: false,
      roles: [],
      deptHeader: false,
      nodes: []
    }
  },
  created () {
    const procDefId = this.$route.query.procDefId
    getNodeList(procDefId).then(res => {
      this.nodes = res.rows.map(n => {
        let icon = ''
        switch (n.type) {
          case 0:
            icon = 'icon-kaishi1'
            break
          case 2:
            icon = 'icon-jieshu'
            break
          default:
            icon = 'icon-shen'
        }
        return { name: n.name, nodeId: n.nodeId, icon: icon, type: n.type }
      })
    })
    getRoleAll().then(res => {
      this.roles = res.rows
    })
    getDeptList().then(res => {
      const data = res.rows
      this.buildtree(data, this.depts, 0)
    })
    getUserList().then(res => {
      this.users = res.rows
    })
  },
  methods: {
    handleSelect (e) {
      const nodeId = e.key
      const node = this.nodes.filter(item => nodeId === item.nodeId)[0]
      if (node.type === 1) {
        getNodeInfo(nodeId).then(res => {
          const data = res.data
          this.mdl = Object.assign(data, node)
          this.roleChecked = data.roleIds.length > 0
          this.deptChecked = data.deptIds.length > 0
          this.userChecked = data.userIds.length > 0
          this.deptHeader = data.deptHeader
          console.log('mdl:', this.mdl)
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.mdl, 'nodeId', 'userIds', 'deptIds', 'roleIds', 'deptHeader'))
            console.log('form.deptHeader:', this.form.getFieldValue('deptHeader'))
            // this.form.setFieldsValue({ ...record })
          })
        })
      } else {
        this.$message.error('只能编辑任务节点')
        this.mdl = {}
        this.roleChecked = this.deptChecked = this.userChecked = this.deptHeader = false
      }
    },
    onChangeRole (e) {
      const value = e.target.checked
      this.roleChecked = value
      if (!value) { this.form.setFieldsValue({ roleIds: [] }) }
    },
    onChangeDept (e) {
      const value = e.target.checked
      this.deptChecked = value
      if (!value) { this.form.setFieldsValue({ deptIds: [] }) }
    },
    buildtree (list, arr, parentId) {
      list.forEach(item => {
        if (item.parentId === parentId) {
          var child = {
            key: item.deptId,
            value: item.deptId, // value是给modal的select用的，2者属性不一样
            title: item.deptName,
            scopedSlots: { title: 'title' },
            children: []
          }
          this.buildtree(list, child.children, item.deptId)
          if (child.children.length === 0) { delete child.children }
          arr.push(child)
        }
      })
    },
    onChangeUser (e) {
      const value = e.target.checked
      this.userChecked = value
      if (!value) { this.form.setFieldsValue({ userIds: [] }) }
    },
    onChangeDeptHeader (e) {
      this.deptHeader = e.target.checked
      this.form.setFieldsValue({ deptHeader: this.deptHeader })
    },
    handleChangeDept (value, label, extra) {
      console.log(extra)
      if (extra.selected && extra.triggerNode.$children.length > 0) {
        this.$message.error('不能选择父节点 ' + extra.triggerNode.title)
        value.splice(value.findIndex(item => item === extra.triggerValue), 1)
      }
    },
    toList () {
      this.$router.push({ name: 'procDefList' })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          this.confirmLoading = true
          updateNodeInfo(values).then(res => {
            if (res.code === 0) {
              this.$message.success('保存成功')
              // this.toList()
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
<style lang="less" scoped>
/deep/ .ant-menu-vertical {
  .ant-menu-item{
    display: flex;
    .anticon{
        font-size: 24px;
        display: flex;
        align-items: center;
    }
  }
}
</style>
