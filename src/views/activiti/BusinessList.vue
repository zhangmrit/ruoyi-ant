<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="申请标题">
              <a-input placeholder="请输入申请标题" v-model="queryParam.title" allowClear/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="状态">
              <a-select placeholder="请选择" v-model="queryParam.status" default-value="0">
                <a-select-option :value="''">全部</a-select-option>
                <a-select-option v-for="(val, key) in statusMap" :key="key" :value="key">{{ val }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="审批结果">
              <a-select placeholder="请选择" v-model="queryParam.result" default-value="0">
                <a-select-option :value="''">全部</a-select-option>
                <a-select-option v-for="(val, key) in resultMap" :key="key" :value="key">{{ val }}</a-select-option>
              </a-select>
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
      <a-button type="primary" icon="plus" @click="$refs.modal.add()">新建</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-button type="danger" icon="delete" @click="delByIds(selectedRowKeys)">删除</a-button>
      </a-dropdown>
    </div>
    <s-table
      size="default"
      ref="table"
      rowKey="id"
      :rowSelection="rowSelection"
      :columns="columns"
      :data="loadData"
      defaultSort="applyTime"
    >
      <span slot="status" slot-scope="text">
        {{ text | statusFilter }}
      </span>
      <span slot="result" slot-scope="text">
        {{ text | resultFilter }}
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="handelAudit(record)">详情</a>
        <a-divider type="vertical" />
        <a :disabled="record.status!==1" @click="cancel([record.procInstId])">撤销</a>
        <a-divider type="vertical" />
        <a :disabled="record.status===1" @click="delByIds([record.id])">删除</a>
      </span>
    </s-table>
    <business-modal ref="modal" @ok="handleOk"/>
    <leave-modal ref="leavemodal" @ok="handleOk" :audit="false"/>
    <purchase-modal ref="purchasemodal" @ok="handleOk" :audit="false"/>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getBusinessListMy, delProcessIns, delBusiness, modalMap, resultMap, statusMap } from '@/api/activiti'
import BusinessModal from './modules/BusinessModal.vue'
import LeaveModal from './modules/LeaveModal.vue'
import PurchaseModal from './modules/PurchaseModal.vue'

export default {
  name: 'TableList',
  components: {
    STable,
    BusinessModal,
    LeaveModal,
    PurchaseModal
  },
  data () {
    return {
      description: '处理中的业务无法被删除',
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
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '申请标题',
          dataIndex: 'title'
        },
        {
          title: '所属流程',
          dataIndex: 'procName'
        },
        {
          title: '当前审批环节',
          dataIndex: 'currentTask'
        },
        {
          title: '审批结果',
          dataIndex: 'result',
          scopedSlots: { customRender: 'result' }
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '申请时间',
          dataIndex: 'applyTime',
          sorter: true
        },
        {
          title: '操作',
          width: '200px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getBusinessListMy(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: [],
      resultMap,
      statusMap,
      firstActed: true
    }
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        getCheckboxProps: record => ({
          props: {
            disabled: record.status === 1 // Column configuration not to be checked
            // name: record.name
          }
        })
      }
    }
  },
  filters: {
    statusFilter (status) {
      return statusMap[status]
    },
    resultFilter (status) {
      return resultMap[status]
    }
  },
  created () {
  },
  activated () {
    if (this.firstActed) {
      this.firstActed = false
    } else {
      this.handleOk()
    }
  },
  methods: {
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleAdd () {
      this.$refs.modal.add()
    },
    handelAudit (record) {
      const modal = modalMap[record.procDefKey]
      this.$refs[modal].show({ businessKey: record.id })
    },
    handleOk () {
      this.$refs.table.refresh(true)
      console.log('handleSaveOk')
    },
    // 撤销
    cancel (ids) {
      // const idstr = ids.map(r => { return '\'' + r + '\'' }).join('')
      delProcessIns({ ids: ids.join(','), reason: '主动撤销' }).then(res => {
        if (res.code === 0) {
          this.$message.success('撤销成功')
          this.handleOk()
        } else {
          this.$message.error(res.msg)
        }
        this.selectedRowKeys = []
      })
    },
    delByIds (ids) {
      // const idstr = ids.map(r => { return '\'' + r + '\'' }).join('')
      delBusiness({ ids: ids.join(',') }).then(res => {
        if (res.code === 0) {
          this.$message.success('删除成功')
          this.handleOk()
        } else {
          this.$message.error(res.msg)
        }
        this.selectedRowKeys = []
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
