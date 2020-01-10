<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="操作人员">
              <a-input placeholder="请输入" v-model="queryParam.operName"/>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="12">
            <a-form-item label="操作类型">
              <a-select placeholder="请选择" v-model="queryParam.businessType" default-value="0">
                <a-select-option :value="''">全部</a-select-option>
                <a-select-option v-for="(b, index) in businessTypes" :key="index" :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="12">
            <a-form-item label="操作状态">
              <a-select placeholder="请选择" v-model="queryParam.status" default-value="0">
                <a-select-option :value="''">全部</a-select-option>
                <a-select-option :value="0">成功</a-select-option>
                <a-select-option :value="1">失败</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="18">
            <a-form-item label="操作时间">
              <a-range-picker v-model="range"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-popconfirm v-has="'monitor:operlog:remove'" title="确认清空吗？" @confirm="clean">
        <a-icon slot="icon" type="question-circle-o" style="color: red" />
        <a-button type="danger" ghost icon="close">清空</a-button>
      </a-popconfirm>
      <a-button type="primary" icon="export" @click="exportExcel()">导出</a-button>
      <a-dropdown v-has="'monitor:operlog:remove'" v-if="selectedRowKeys.length > 0">
        <a-button type="danger" icon="delete" @click="delByIds(selectedRowKeys)">删除</a-button>
      </a-dropdown>
    </div>
    <s-table
      size="default"
      ref="table"
      rowKey="operId"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :columns="columns"
      :data="loadData"
      :rangPicker="range"
      defaultSort="operTime"
      v-if="operTypeMap"
    >
      <span slot="businessType" slot-scope="text">
        {{ text | operTypeFilter }}
      </span>
      <span slot="status" slot-scope="text">
        {{ text | statusFilter }}
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="handleDetail(record)">详细</a>
      </span>
    </s-table>
    <operLog-modal ref="modal" :operTypeMap="operTypeMap" v-if="operTypeMap"/>
  </a-card>
</template>

<script>
import { STable } from '@/components'
// import { getOperLogList, delOperLog, cleanOperLog, operLogExport } from '@/api/monitor'
import { getOperLogList, operLogExport } from '@/api/monitor'
import OperLogModal from './modules/OperLogModal.vue'
import { getDictArray } from '@/utils/dict'
import { exportExcel } from '@/utils/download'
const operTypeMap = {}
export default {
  name: 'TableList',
  components: {
    STable,
    OperLogModal
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
          title: '日志编号',
          dataIndex: 'operId'
        },
        {
          title: '系统模块',
          dataIndex: 'title'
        },
        {
          title: '操作类型',
          dataIndex: 'businessType',
          scopedSlots: { customRender: 'businessType' }
        },
        {
          title: '操作人员',
          dataIndex: 'operName'
        },
        {
          title: '主机',
          dataIndex: 'operIp'
        },
        {
          title: '操作地点',
          dataIndex: 'operLocation'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作时间',
          dataIndex: 'operTime',
          sorter: true
        }, {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      range: null,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getOperLogList(Object.assign(parameter, this.queryParam))
      },
      operTypeMap,
      businessTypes: [],
      selectedRowKeys: [],
      selectedRows: []

    }
  },
  filters: {
    operTypeFilter (type) {
      return operTypeMap[type].text
    },
    statusFilter (status) {
      const statusMap = {
        '1': '失败',
        '0': '成功'
      }
      return statusMap[status]
    }
  },
  beforeCreate () {

  },
  async created () {
    // 字典两种用法，各有优缺点
    // operTypeMap = await getDictMap('sys_oper_type')
    // this.operTypeMap = operTypeMap
    // this.operTypeMap.forEach((value, key, mymap) => {
    //   this.businessTypes.push({ code: key, label: value })
    // })
    this.businessTypes = await getDictArray('sys_oper_type')
    this.businessTypes.map(d => {
      operTypeMap[d.dictValue] = { text: d.dictLabel }
    })
  },
  methods: {
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleDetail (record) {
      this.$refs.modal.detail(record)
    },
    handleOk () {
      this.$refs.table.refresh(true)
    },
    exportExcel () {
      exportExcel(operLogExport, this.queryParam)
    },
    delByIds (ids) {
      this.$message.success(`你删除了` + ids)
      // delOperLog({ ids: ids.join(',') }).then(res => {
      //   if (res.code === 0) {
      //     this.$message.success(`删除成功`)
      //     this.handleOk()
      //   } else {
      //     this.$message.error(res.msg)
      //   }
      //   this.selectedRowKeys = []
      // })
    },
    clean () {
      this.$message.success(`你点击了清空`)
      // cleanOperLog().then(res => {
      //   this.handleOk()
      // })
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
