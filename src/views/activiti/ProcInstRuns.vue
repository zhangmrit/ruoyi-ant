<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="流程定义key">
              <a-input placeholder="请输入" v-model="queryParam.key" allowClear/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-dropdown :disabled="selectedRowKeys.length === 0">
        <a-button type="danger" icon="delete" @click="delByIds(selectedRowKeys)">删除</a-button>
      </a-dropdown>
    </div>
    <s-table
      size="default"
      ref="table"
      rowKey="id"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :columns="columns"
      :data="loadData"
    >
      <span slot="isSuspended" slot-scope="text">
        {{ text?'挂起':'激活' }}
      </span>
      <span slot="action" slot-scope="text, record">
        <a-popconfirm
          placement="topRight"
          title="该操作会一并 激活/挂起 所有当前实例?"
          @confirm="handleState(record)"
          okText="是"
          cancelText="否"
        >
          <a>{{ record.isSuspended?'激活':'挂起' }}</a>
        </a-popconfirm>
        <a-divider type="vertical" />
        <a @click="delByIds([record.id])">删除</a>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getProfInfRuns, delProcessIns, processInsState } from '@/api/activiti'
import { checkPermission } from '@/utils/permissions'

export default {
  name: 'RunsProcess',
  components: {
    STable
  },
  data () {
    return {
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      form: this.$form.createForm(this),
      mdl: {},
      permissions: [],
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '流程实例ID',
          dataIndex: 'procInstId'
        },
        {
          title: '流程名称',
          dataIndex: 'name'
        },
        {
          title: '版本',
          dataIndex: 'version'
        },
        {
          title: '申请人',
          dataIndex: 'applyer'
        },
        {
          title: '标识key',
          dataIndex: 'key'
        },
        {
          title: '当前环节',
          dataIndex: 'currTaskName'
        },
        {
          title: '部署ID',
          dataIndex: 'deployId'
        },
        {
          title: '状态',
          dataIndex: 'isSuspended',
          scopedSlots: { customRender: 'isSuspended' }
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
        return getProfInfRuns(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: [],
      addEnable: checkPermission('activiti:prof:add'),
      editEnabel: checkPermission('activiti:prof:edit'),
      removeEnable: checkPermission('activiti:prof:remove')
    }
  },
  filters: {
  },
  created () {
  },
  methods: {
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    handleOk () {
      this.$refs.table.refresh(true)
      console.log('handleSaveOk')
    },
    handleState (record) {
      const state = record.isSuspended ? 'active' : 'suspend'
      processInsState(record.procInstId, state).then(res => {
        if (res.code === 0) {
          record.isSuspended = !record.isSuspended
        }
      })
    },
    delByIds (ids) {
      delProcessIns({ ids: ids.join(','), reason: '流程中止' }).then(res => {
        if (res.code === 0) {
          this.$message.success(`删除成功`)
          this.handleOk()
        } else {
          this.$message.error(res.msg)
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
