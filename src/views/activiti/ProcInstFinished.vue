<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="流程定义key">
              <a-input placeholder="请输入" v-model="queryParam.procDefKey" allowClear/>
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
      <a-button :disabled="!selectedRowKeys.length>0" type="danger" icon="delete" @click="delByIds(selectedRowKeys)">删除</a-button>
    </div>
    <s-table
      size="default"
      ref="table"
      rowKey="id"
      :rowSelection="rowSelection"
      :columns="columns"
      :data="loadData"
    >
      <span slot="result" slot-scope="text">
        {{ text | resultFilter }}
      </span>
      <span slot="action" slot-scope="text, record">
        <a v-if="removeEnable" @click="delByIds([record.id])">删除</a>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { millsToTime } from '@/utils/util'
import { getProfInfFinished, delHiProcessIns, resultMap } from '@/api/activiti'
import { checkPermission } from '@/utils/permissions'
export default {
  name: 'ProfList',
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
          dataIndex: 'id'
        },
        {
          title: '流程名称',
          dataIndex: 'procName'
        },
        {
          title: '申请人',
          dataIndex: 'applyer'
        },
        {
          title: '标识key',
          dataIndex: 'procDefKey'
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
          title: '结束原因',
          dataIndex: 'deleteReason'
        },
        {
          title: '开始时间',
          dataIndex: 'startTime'
        },
        {
          title: '结束时间',
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
        return getProfInfFinished(Object.assign(parameter, this.queryParam))
      },
      previewVisible: false,
      previewImage: '',
      selectedRowKeys: [],
      selectedRows: [],
      addEnable: checkPermission('activiti:prof:add'),
      editEnabel: checkPermission('activiti:prof:edit'),
      removeEnable: checkPermission('activiti:prof:remove')
    }
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        getCheckboxProps: record => ({
          // props: {
          //   disabled: record.deploymentId, // Column configuration not to be checked
          //   name: record.name
          // }
        })
      }
    }
  },
  filters: {
    resultFilter (result) {
      return resultMap[result]
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
    delByIds (ids) {
      delHiProcessIns({ ids: ids.join(',') }).then(res => {
        if (res.code === 0) {
          this.$message.success(`删除成功`)
          this.handleOk()
        } else {
          this.$message.error(res.msg)
        }
      }).finally(
        this.selectedRowKeys = []
      )
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
