<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="部门名称" >
              <a-input placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="状态">
              <a-select placeholder="请选择">
                <a-select-option value="-1">全部</a-select-option>
                <a-select-option value="0">正常</a-select-option>
                <a-select-option value="1">停用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary">查询</a-button>
              <a-button style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button v-has="'user:add'" type="primary" icon="plus" @click="$refs.modal.add()">新建</a-button>
    </div>
    <s-table
      ref="table"
      rowKey="deptId"
      showPagination="false"
      :columns="columns"
      :data="loadData">

      <span slot="menuType" slot-scope="text">
        {{ text | menuTypeFilter }}
      </span>

      <span slot="status" slot-scope="text">
        {{ text | statusFilter }}
      </span>

      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="handleAdd(record.deptId+'')">新增</a>
        <a-divider type="vertical" />
        <a @click="delByIds(record.deptId)">删除</a>
      </span>
    </s-table>

    <dept-modal ref="modal" @ok="handleOk"/>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getDeptList } from '@/api/manage'
import DeptModal from './modules/DeptModal.vue'
import { treeData } from '@/utils/treeutil'
export default {
  name: 'TableList',
  components: {
    STable,
    DeptModal
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
      form: null,
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '权限名称',
          dataIndex: 'deptName'
        },
        {
          title: '排序',
          dataIndex: 'orderNum'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getDeptList(Object.assign(parameter, this.queryParam)
        ).then(res => {
          res.rows = treeData(res.rows, 'deptId')
          console.log(res.rows)

          return res
        })
      },

      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        '1': '停用',
        '0': '正常'
      }
      return statusMap[status]
    },
    menuTypeFilter (type) {
      const menuMap = {
        'M': '目录',
        'F': '按钮',
        'C': '菜单'
      }
      return menuMap[type]
    }
  },
  created () {
  },
  methods: {
    handleAdd (parentId) {
      this.$refs.modal.add(parentId)
    },
    handleEdit (record) {
      this.$refs.modal.edit(record)
    },
    handleOk () {
      this.$refs.table.refresh()
      console.log('handleSaveOk')
    },
    onChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    // buildtree (arr, parentId) {
    //   const array = []
    //   arr.forEach(item => {
    //     if (item.parentId === parentId) {
    //       item.parentId += ''
    //       item.children = this.buildtree(arr, item.deptId)
    //       if (item.children.length === 0) { delete item.children }
    //       array.push(item)
    //     }
    //   })
    //   return array
    // },
    // buildtree (list) {
    //   const cloneData = JSON.parse(JSON.stringify(list)) // 对源数据深度克隆
    //   return cloneData.filter(father => {
    //     const branchArr = cloneData.filter(child => father.deptId === child.parentId) // 返回每一项的子级数组
    //     if (branchArr.length > 0) father.children = branchArr // 如果存在子级，则给父级添加一个children属性，并赋值
    //     return father.parentId === 0 // 返回第一层
    //   })
    // },
    delByIds (ids) {
      this.$message.success(`${ids} 删除成功`)
      this.handleOk()
    },
    onChangeStatus (record) {
      record.status = record.status === 1 ? 2 : 1
      // 发送状态到服务器
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
