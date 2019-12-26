<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="唯一键">
              <a-input placeholder="请输入" v-model="queryParam.menuKey"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="权限名称">
              <a-input placeholder="请输入" v-model="queryParam.menuName"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="状态">
              <a-select placeholder="请选择" v-model="queryParam.visible">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="0">显示</a-select-option>
                <a-select-option value="1">隐藏</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="this.fetch">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button v-if="addEnable" type="primary" icon="plus" @click="$refs.modal.add()">新建</a-button>
    </div>
    <a-table
      ref="table"
      rowKey="menuId"
      :pagination="pagination"
      :loading="loading"
      :columns="columns"
      :dataSource="data">

      <span slot="menuType" slot-scope="text">
        {{ text | menuTypeFilter }}
      </span>

      <span slot="visible" slot-scope="text">
        {{ text | statusFilter }}
      </span>

      <span slot="action" slot-scope="text, record">
        <a v-if="editEnabel" @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a v-if="addEnable" @click="handleAdd(record.menuId+'')">新增</a>
        <a-divider type="vertical" />
        <a v-if="removeEnable" @click="delById(record.menuId)">删除</a>
      </span>
    </a-table>

    <permission-modal ref="modal" @ok="handleOk" />
  </a-card>
</template>

<script>
import { Table as T } from 'ant-design-vue'
import { getPermissions, delPerm } from '@/api/system'
import PermissionModal from './modules/PermissionModal.vue'
import { treeData } from '@/utils/treeutil'
import { checkPermission } from '@/utils/permissions'
export default {
  name: 'TableList',
  components: {
    T,
    PermissionModal
  },
  data () {
    return {
      description: '菜单管理，只有menuKey(唯一)不为空才生效',

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
          title: '路由唯一键',
          dataIndex: 'menuKey'
        },
        {
          title: '组件',
          dataIndex: 'component'
        },
        {
          title: '排序',
          dataIndex: 'orderNum'
        },
        {
          title: '按钮类型',
          dataIndex: 'menuType',
          scopedSlots: { customRender: 'menuType' }
        },
        {
          title: '链接',
          dataIndex: 'path'
        },
        {
          title: '重定向',
          dataIndex: 'redirect'
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
      data: [],
      pagination: false,
      loading: false,
      addEnable: checkPermission('system:menu:add'),
      editEnabel: checkPermission('system:menu:edit'),
      removeEnable: checkPermission('system:menu:remove')
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
    this.fetch()
  },
  methods: {
    handleAdd (parentId) {
      this.$refs.modal.add(parentId)
    },
    handleEdit (record) {
      this.$refs.modal.edit(record)
    },
    handleOk () {
      // this.$refs.table.refresh()
      this.fetch()
      console.log('handleSaveOk')
    },
    delById (id) {
      delPerm(id).then(res => {
        if (res.code === 0) {
          this.$message.success(`删除成功`)
          this.handleOk()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    fetch () {
      this.loading = true
      getPermissions(Object.assign(this.queryParam)).then(res => {
        this.data = treeData(res.rows, 'menuId')
        this.loading = false
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
