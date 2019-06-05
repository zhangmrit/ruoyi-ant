<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="操作人员">
              <a-input placeholder="请输入" v-model="queryParam.roleName"/>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="12">
            <a-form-item label="操作类型">
              <a-select placeholder="请选择" v-model="queryParam.status" default-value="0">
                <a-select-option :value="''">全部</a-select-option>
                <a-select-option :value="0">正常</a-select-option>
                <a-select-option :value="1">禁用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="12">
            <a-form-item label="操作状态">
              <a-select placeholder="请选择" v-model="queryParam.status" default-value="0">
                <a-select-option :value="''">全部</a-select-option>
                <a-select-option :value="0">正常</a-select-option>
                <a-select-option :value="1">禁用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="18">
            <a-form-item label="操作时间">
              <a-range-picker @change="onChangedate" v-model="rang"/>
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
      <a-popconfirm title="确认清空吗？" @confirm="clean">
        <a-icon slot="icon" type="question-circle-o" style="color: red" />
        <a-button type="danger" ghost icon="close">清空</a-button>
      </a-popconfirm>
      <a-dropdown v-has="'role:del'" v-if="selectedRowKeys.length > 0">
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
    >
      <span slot="status" slot-scope="text">
        {{ text | statusFilter }}
      </span>
      <span slot="action" slot-scope="text, record">
        <a v-has="'user:edit'" @click="handleDetail(record)">详细</a>
      </span>
    </s-table>
    <operLog-modal ref="modal"/>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getOperLogList, delOperLog, cleanOperLog } from '@/api/monitor'
import OperLogModal from './modules/OperLogModal.vue'
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
          dataIndex: 'businessType'
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
      rang: null,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        if (this.queryParam.rang) {
          this.queryParam.startTime = this.queryParam.rang[0].format('YYYY-MM-DD')
          this.queryParam.endtTime = this.queryParam.rang[1].format('YYYY-MM-DD')
          this.queryParam.rang = null
        }
        return getOperLogList(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: []

    }
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        '1': '失败',
        '0': '成功'
      }
      return statusMap[status]
    }
  },
  created () {
  },
  methods: {
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    handleDetail (record) {
      this.$refs.modal.detail(record)
    },
    onChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    onChangedate (date, dateString) {
      console.log(date, dateString)
      console.log(this.queryParam.rang)
    },
    handleOk () {
      this.$refs.table.refresh(true)
    },
    delByIds (ids) {
      delOperLog({ ids: ids.join(',') }).then(res => {
        if (res.code === 0) {
          this.$message.success(`删除成功`)
          this.handleOk()
        } else {
          this.$message.error(res.msg)
        }
        this.selectedRowKeys = []
      })
    },
    clean () {
      cleanOperLog().then(res => {
        this.handleOk()
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
