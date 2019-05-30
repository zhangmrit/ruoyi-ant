<template>
  <a-card :bordered="false">
    <a-row :gutter="8">
      <a-col :span="5">
        <s-tree
          :dataSource="deptTree"
          :openKeys.sync="openKeys"
          @click="handleClick">
        </s-tree>
      </a-col>
      <a-col :span="19">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="48">
              <a-col :md="5" d:sm="15">
                <a-form-item label="用户名">
                  <a-input placeholder="请输入" v-model="queryParam.loginName"/>
                </a-form-item>
              </a-col>
              <a-col :md="5" d:sm="15">
                <a-form-item label="状态">
                  <a-select placeholder="请选择" v-model="queryParam.status" >
                    <a-select-option :value="''">全部</a-select-option>
                    <a-select-option :value="'0'">正常</a-select-option>
                    <a-select-option :value="'1'">禁用</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="5" d:sm="15">
                <span class="table-page-search-submitButtons">
                  <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                  <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div class="table-operator">
          <!-- <a-button type="primary" icon="plus" @click="$refs.modal.add()">新建</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0"> -->
          <a-button v-has="'user:add'" type="primary" icon="plus" @click="$refs.modal.add()">新建</a-button>
          <a-dropdown v-has="'user:edit'" v-if="selectedRowKeys.length > 0">
            <!-- <a-menu slot="overlay">
          <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
          <a-menu-item key="2"><a-icon type="lock" />禁用</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作 <a-icon type="down" />
        </a-button> -->
            <a-button type="danger" icon="delete" @click="delByIds(selectedRowKeys)">删除</a-button>
          </a-dropdown>
        </div>
        <s-table
          size="default"
          ref="table"
          rowKey="userId"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          :columns="columns"
          :data="loadData"
        >
          <span slot="status" slot-scope="text,record">
            <a-switch :checked="record.status=='0'" @change="onChangeStatus(record)"/>
          </span>
          <span slot="action" slot-scope="text, record">
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="delByIds([record.userId])">删除</a>
          </span>
        </s-table>
      </a-col>
    </a-row>
    <user-modal ref="modal" @ok="handleOk" :deptTree="deptTree"/>
  </a-card>
</template>

<script>
import STree from '@/components/Tree/Tree'
import { STable } from '@/components'
import { getUserList, getDeptList, delUser, changUserStatus } from '@/api/system'
import UserModal from './modules/UserModal'
import pick from 'lodash.pick'
export default {
  name: 'TableList',
  components: {
    STree,
    STable,
    UserModal
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
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '用户名',
          dataIndex: 'loginName'
        },
        {
          title: '昵称',
          dataIndex: 'userName'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true
        }, {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getUserList(Object.assign(parameter, this.queryParam))
          .then(res => {
            console.log('getUserList', res)
            return res
          })
      },
      openKeys: ['100'],
      deptTree: [],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created () {
    getDeptList().then(res => {
      this.buildtree(res.rows, this.deptTree, 0)
    })
  },
  methods: {
    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    handleEdit (record) {
      this.$refs.modal.edit(record)
    },
    onChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleOk () {
      this.$refs.table.refresh()
      console.log('handleSaveOk')
    },
    delByIds (ids) {
      delUser({ ids: ids.join(',') }).then(res => {
        if (res.code === 0) {
          this.$message.success(`删除成功`)
          this.handleOk()
        } else {
          this.$message.error(res.msg)
        }
        // const difference = new Set(this.selectedRowKeys.filter(x => !new Set(ids).has(x)))
        // this.selectedRowKeys = Array.from(difference)
        this.selectedRowKeys = []
      })
    },
    onChangeStatus (record) {
      record.status = record.status === '0' ? '1' : '0'
      changUserStatus(pick(record, 'userId', 'status'))
      // 发送状态到服务器
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
    handleClick (e) {
      this.queryParam = {
        deptId: e.key
      }
      this.$refs.table.refresh(true)
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
