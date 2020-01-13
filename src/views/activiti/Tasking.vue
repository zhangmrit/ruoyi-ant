<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="流程定义key">
              <a-input placeholder="请输入" v-model="queryParam.processDefKey" allowClear/>
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
      <a-button :disabled="selectedRowKeys.length===0" type="primary" icon="check" @click="handelAuditBatch(selectedRowKeys,2)">批量同意</a-button>
      <a-button :disabled="selectedRowKeys.length===0" icon="close" @click="handelAuditBatch(selectedRowKeys,3)">批量驳回</a-button>
    </div>
    <s-table
      size="default"
      ref="table"
      rowKey="id"
      :rowSelection="rowSelection"
      :columns="columns"
      :data="loadData"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="suspended" slot-scope="text">
        <a-badge :status="text?'error':'processing'" :text="text?'挂起':'激活'" />
      </span>
      <span slot="action" slot-scope="text, record">
        <!-- <a-divider v-if="editEnabel" type="vertical" />
        <a v-if="editEnabel" @click="handleEdit(record.id)">编辑</a> -->
        <a @click="handelAudit(record)" :disabled="record.suspended">审批</a>
        <a-divider type="vertical" />
        <a @click="handFlow(record.procInstId)">历史</a>
      </span>
    </s-table>
    <leave-modal ref="leavemodal" @ok="handleOk"/>
    <purchase-modal ref="purchasemodal" @ok="handleOk"/>
    <proc-flow-modal ref="modal" @ok="handleOk"/>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getTasking, auditTaskBatch, modalMap } from '@/api/activiti'
import LeaveModal from './modules/LeaveModal.vue'
import PurchaseModal from './modules/PurchaseModal.vue'
import ProcFlowModal from './modules/ProcFlowModal.vue'
export default {
  name: 'Tasking',
  components: {
    STable,
    LeaveModal,
    ProcFlowModal,
    PurchaseModal
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
          title: '#',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '流程标题',
          dataIndex: 'processName'
        },
        {
          title: '所属流程',
          dataIndex: 'processDefName'
        },
        {
          title: '节点名称',
          dataIndex: 'name'
        },
        {
          title: '申请人',
          dataIndex: 'applyer'
        },
        {
          title: '状态',
          dataIndex: 'suspended',
          scopedSlots: { customRender: 'suspended' }
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
        return getTasking(Object.assign(parameter, this.queryParam))
      },
      previewVisible: false,
      previewImage: '',
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        getCheckboxProps: record => ({
          props: {
            disabled: record.suspended // Column configuration not to be checked
          }
        })
      }
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
    handFlow (procInstId) {
      this.$refs.modal.show(procInstId)
    },
    handelAudit (record) {
      const modal = modalMap[record.processDefKey]
      this.$refs[modal].show(record)
    },
    handelAuditBatch (taskIds, result) {
      auditTaskBatch({ taskIds: taskIds, result: result }).then(res => {
        if (res.code === 0) {
          this.handleOk()
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
