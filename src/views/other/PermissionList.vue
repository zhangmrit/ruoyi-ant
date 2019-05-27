<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="权限名称" >
              <a-input placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="状态">
              <a-select placeholder="请选择">
                <a-select-option value="-1">全部</a-select-option>
                <a-select-option value="0">显示</a-select-option>
                <a-select-option value="1">隐藏</a-select-option>
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
      rowKey="menuId"
      showPagination="false"
      :columns="columns"
      :data="loadData">

      <span slot="menuType" slot-scope="text">
        {{ text | menuTypeFilter }}
      </span>

      <span slot="visible" slot-scope="text">
        {{ text | statusFilter }}
      </span>

      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="handleAdd(record.menuId+'')">新增</a>
        <a-divider type="vertical" />
        <a @click="delByIds(record.menuId)">删除</a>
      </span>
    </s-table>

    <permission-modal ref="modal" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import PermissionModal from './modules/PermissionModal.vue'
export default {
  name: 'TableList',
  components: {
    STable,
    PermissionModal
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
          dataIndex: 'menuName'
        },
        {
          title: '排序',
          dataIndex: 'orderNum'
        },
        {
          title: '地址',
          dataIndex: 'url'
        },
        {
          title: '按钮类型',
          dataIndex: 'menuType',
          scopedSlots: { customRender: 'menuType' }
        },
        {
          title: '权限标识',
          dataIndex: 'perms'
        },
        {
          title: '状态',
          dataIndex: 'visible',
          scopedSlots: { customRender: 'visible' }
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      preList: null,
      // 向后端拉取可以用的操作列表
      permissionList: null,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return this.$http.get('/permission/list', {
          params: Object.assign(parameter, this.queryParam)
        }).then(res => {
          res.rows = this.buildtree(res.rows, 0)
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
        '1': '隐藏',
        '0': '显示'
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

    },
    onChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    buildtree (arr, parentId) {
      const array = []
      arr.forEach(item => {
        if (item.parentId === parentId) {
          item.parentId += ''
          item.children = this.buildtree(arr, item.menuId)
          if (item.children.length === 0) { delete item.children }
          array.push(item)
        }
      })
      return array
    },
    swap () {

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
