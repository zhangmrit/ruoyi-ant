<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button v-if="addEnable" type="primary" icon="plus" @click="$refs.modal.add()">新建</a-button>
    </div>
    <s-table
      size="default"
      ref="table"
      rowKey="id"
      :columns="columns"
      :data="loadData"
    >
      <span slot="action" slot-scope="text, record">
        <a v-if="editEnabel" @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a v-if="removeEnable" @click="delById([record.id])">删除</a>
      </span>
    </s-table>
    <defineParm-modal ref="modal" @ok="handleOk"/>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getDefineParmList, delDefineParm } from '@/api/open-api/defineParm'
import DefineParmModal from './modules/DefineParmModal.vue'
import { checkPermission } from '@/utils/permissions'

export default {
  name: 'TableList',
  props: ['apiId'],
  components: {
    STable,
    DefineParmModal
  },
  data () {
    return {
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
          title: '参数中文名',
          dataIndex: 'zhName'
        },
        {
          title: '参数英文名',
          dataIndex: 'enName'
        },
        {
          title: '参数类型',
          dataIndex: 'type'
        },
        {
          title: '是否必填',
          dataIndex: 'isRequired'
        },
        {
          title: '默认值',
          dataIndex: 'defaultValue'
        },
        {
          title: '备注信息',
          dataIndex: 'remarks'
        },
        {
          title: '操作',
          width: '200px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: parameter => {
        return getDefineParmList(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: [],
      addEnable: checkPermission('open-api:defineParm:add'),
      editEnabel: checkPermission('open-api:defineParm:edit'),
      removeEnable: checkPermission('open-api:defineParm:remove')
    }
  },
  filters: {
  },
  created () {
    console.log(this.apiId)
    // this.queryParam.apiId = this.apiId
    this.queryParam.apiId = '1'
  },
  methods: {
    handleAdd () {
      this.$refs.modal.add()
    },
    handleEdit (record) {
      this.$refs.modal.edit(record)
    },
    handleOk () {
      this.$refs.table.refresh(true)
      console.log('handleSaveOk')
    },
    delById (id) {
      delDefineParm({ ids: id }).then(res => {
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
