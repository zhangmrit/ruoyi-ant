<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="任务名称">
              <a-input placeholder="请输入" v-model="queryParam.taskName" allowClear/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="已删除">
              <a-select v-model="queryParam.delFlag">
                <a-select-option :value="false">否</a-select-option>
                <a-select-option :value="true">是</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {delFlag: false}">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button :disabled="selectedRowKeys.length===0" type="danger" icon="delete" @click="delByIds(selectedRowKeys)">删除</a-button>
    </div>
    <s-table
      size="default"
      ref="table"
      rowKey="auditId"
      :rowSelection="rowSelection"
      :columns="columns"
      :data="loadData"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="result" slot-scope="text">
        {{ text |resultFilter }}
      </span>
      <span slot="action" slot-scope="text, record">
        <!-- <a-divider v-if="editEnabel" type="vertical" />
        <a v-if="editEnabel" @click="handleEdit(record.id)">编辑</a> -->
        <a @click="handelAudit(record)">详情</a>
        <a-divider type="vertical" />
        <a @click="handFlow(record.procInstId)">历史</a>
        <a-divider v-if="!record.delFlag" type="vertical" />
        <a v-if="!record.delFlag" @click="delByIds([record.auditId])">删除</a>
      </span>
    </s-table>
    <leave-modal ref="leavemodal" @ok="handleOk" :audit="audit"/>
    <purchase-modal ref="purchasemodal" @ok="handleOk" :audit="false"/>
    <proc-flow-modal ref="modal" @ok="handleOk"/>
  </a-card>
</template>

<script>
import { millsToTime } from '@/utils/util'
import { STable } from '@/components'
import { getTaskdone, delTaskLogic, processInsState, modalMap } from '@/api/activiti'
import LeaveModal from './modules/LeaveModal.vue'
import PurchaseModal from './modules/PurchaseModal.vue'
import ProcFlowModal from './modules/ProcFlowModal.vue'
const resultMap = {
  '1': '处理中',
  '2': '通过',
  '3': '驳回',
  '4': '撤销'
}
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
      queryParam: { delFlag: false },
      // 表头
      columns: [
        {
          title: '#',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '申请标题',
          dataIndex: 'title'
        },
        {
          title: '所属流程',
          dataIndex: 'procName'
        },
        {
          title: '任务名称',
          dataIndex: 'taskName'
        },
        {
          title: '申请人',
          dataIndex: 'applyer'
        },
        {
          title: '审批结果',
          dataIndex: 'result',
          scopedSlots: { customRender: 'result' }
        },
        {
          title: '耗时',
          dataIndex: 'duration',
          customRender: (text) => millsToTime(text)
        },
        {
          title: '指派时间',
          dataIndex: 'startTime'
        },
        {
          title: '审批时间',
          dataIndex: 'endTime'
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
        return getTaskdone(Object.assign(parameter, this.queryParam))
      },
      audit: false,
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
            disabled: record.delFlag // Column configuration not to be checked
          }
        })
      }
    }
  },
  filters: {
    resultFilter (status) {
      return resultMap[status]
    }
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
      const modal = modalMap[record.procDefKey]
      this.$refs[modal].show(record)
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
      if (ids.length > 0) {
        delTaskLogic({ ids: ids.join(',') }).then(res => {
          if (res.code === 0) {
            this.$message.success(`删除成功`)
            this.handleOk()
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.$message.error('没有选择数据')
      }
      this.selectedRowKeys = []
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
