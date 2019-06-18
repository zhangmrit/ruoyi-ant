<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="部门名称" >
              <a-input placeholder="请输入" v-model="queryParam.deptName"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="状态">
              <a-select placeholder="请选择" v-model="queryParam.status">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="0">正常</a-select-option>
                <a-select-option value="1">停用</a-select-option>
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
      rowKey="deptId"
      :pagination="pagination"
      :loading="loading"
      :columns="columns"
      :dataSource="data">

      <span slot="menuType" slot-scope="text">
        {{ text | menuTypeFilter }}
      </span>

      <span slot="status" slot-scope="text">
        {{ text | statusFilter }}
      </span>

      <span slot="action" slot-scope="text, record">
        <a v-if="editEnabel" @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a v-if="addEnable" @click="handleAdd(record.deptId+'')">新增</a>
        <a-divider type="vertical" />
        <a v-if="removeEnable" @click="delById(record.deptId)">删除</a>
      </span>
    </a-table>

    <dept-modal ref="modal" @ok="handleOk"/>
  </a-card>
</template>

<script>
import { Table as T } from 'ant-design-vue'
import { getDeptList, delDept } from '@/api/system'
import DeptModal from './modules/DeptModal.vue'
import { treeData } from '@/utils/treeutil'
import { checkPermission } from '@/utils/permissions'
export default {
  name: 'TableList',
  components: {
    T,
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
      data: [],
      pagination: false,
      loading: false,
      addEnable: checkPermission('system:dept:add'),
      editEnabel: checkPermission('system:dept:edit'),
      removeEnable: checkPermission('system:dept:remove')
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
      this.fetch()
    },
    delById (id) {
      delDept(id).then(res => {
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
      getDeptList(Object.assign(this.queryParam)).then(res => {
        this.data = treeData(res.rows, 'deptId')
        this.loading = false
        console.log(this.data)
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
