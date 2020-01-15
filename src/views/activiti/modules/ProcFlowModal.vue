<template>
  <a-modal
    title="操作"
    style="top: 20px;"
    :width="1200"
    v-model="visible"
    :footer="null"
  >
    <a-table
      ref="table"
      rowKey="id"
      :loading="loading"
      :columns="columns"
      :dataSource="taskList"
    >

      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="result" slot-scope="text">
        {{ text | resultFilter }}
      </span>

      <span slot="action" slot-scope="text, record">
        <a v-if="editEnabel" @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a v-if="addEnable" @click="handleAdd(record.menuId+'')">新增</a>
        <a-divider type="vertical" />
        <a v-if="removeEnable" @click="delById(record.menuId)">删除</a>
      </span>
    </a-table>
    <img style="" :src="procFlowUrl" />
  </a-modal>
</template>
<script>
import { millsToTime } from '@/utils/util'
import { getTaskFlow, hightlightFlow } from '@/api/activiti'
const resultMap = {
  '1': '处理中',
  '2': '通过',
  '3': '驳回',
  '4': '撤销'
}

export default {
  name: 'ProcFlowModal',
  props: {
  },
  components: {
  },
  data () {
    return {
      visible: false,
      loading: false,
      procFlowUrl: '',
      taskList: [],
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
          title: '任务名称',
          dataIndex: 'taskName'
        },
        {
          title: '审批人',
          dataIndex: 'auditor'
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
        }
      ]
    }
  },
  beforeCreate () {
  },
  created () {
  },
  filters: {
    resultFilter (type) {
      return type ? resultMap[type] : '待审批'
    }
  },
  methods: {
    show (procInstId) {
      this.loading = true
      getTaskFlow({ procInstId: procInstId }).then(res => {
        if (res.code === 0) {
          this.taskList = res.rows
          hightlightFlow(procInstId).then(data => {
            const raw = data.data
            this.procFlowUrl = URL.createObjectURL(raw)
          })
          this.visible = true
        }
      }).finally(
        this.loading = false
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
