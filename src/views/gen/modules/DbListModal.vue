<template>
  <a-modal
    title="导入表结构"
    style="top: 20px;"
    :width="800"
    v-model="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
  >
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="表名称">
              <a-input placeholder="请输入" v-model="queryParam.tableName"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="表描述">
              <a-input placeholder="请输入" v-model="queryParam.tableComment"/>
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
    <s-table
      size="default"
      ref="table"
      rowKey="tableName"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :columns="columns"
      :data="loadData"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
    </s-table>
  </a-modal>
</template>

<script>
import { STable } from '@/components'
import { getDbList, importTable } from '@/api/gen'
import { checkPermission } from '@/utils/permissions'

export default {
  name: 'TableList',
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
      queryParam: { },
      // 表头
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '表名',
          dataIndex: 'tableName'
        },
        {
          title: '表描述',
          dataIndex: 'tableComment'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          sorter: true
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getDbList(Object.assign(parameter, this.queryParam))
      },
      confirmLoading: false,
      selectedRowKeys: [],
      selectedRows: [],
      addEnable: checkPermission('system:dict:add'),
      editEnabel: checkPermission('system:dict:edit'),
      removeEnable: checkPermission('system:dict:remove')
    }
  },
  filters: {
  },
  created () {
  },
  methods: {
    show () {
      this.visible = true
      this.$refs.table && this.$refs.table.refresh(true)
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleEdit (record) {
      this.$refs.modal.edit(record)
    },
    handleOk () {
      this.$refs.table.refresh(true)
      console.log('handleSaveOk')
    },
    handleSubmit (e) {
      e.preventDefault()
      this.confirmLoading = true
      importTable({ tables: this.selectedRowKeys.join(',') }).then(res => {
        if (res.code === 0) {
          this.$message.success('保存成功')
          this.$emit('ok')
          this.visible = false
        } else {
          this.$message.success(res.msg)
        }
      }).catch(() => {
        this.$message.error('系统错误，请稍后再试')
      }).finally(() => {
        this.confirmLoading = false
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
