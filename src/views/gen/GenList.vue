<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="表名称">
              <a-input placeholder="请输入" v-model="queryParam.tableName"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="表描述">
              <a-input placeholder="请输入" v-model="queryParam.tableComment"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="18">
            <a-form-item label="表时间">
              <a-range-picker v-model="range"/>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="12">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button icon="upload" type="primary" @click="lead()">导入</a-button>
      <!-- <a-button type="primary" icon="download" @click="gen(selectedRowKeys)">生成</a-button> -->
      <!-- <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-button type="danger" icon="delete" @click="delByIds(selectedRowKeys)">删除</a-button>
      </a-dropdown> -->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchGen(selectedRowKeys)"><a-icon type="download" />生成代码</a-menu-item>
          <a-menu-item key="2" @click="delByIds(selectedRowKeys)"><a-icon type="delete" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作 <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>
    <s-table
      size="default"
      ref="table"
      rowKey="tableId"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :columns="columns"
      :data="loadData"
      :rangPicker="range"
      defaultSort="createTime"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="action" slot-scope="text, record">
        <a v-if="editEnable" @click="handlePreview(record.tableId)">预览</a>
        <a-divider type="vertical" />
        <a v-if="editEnable" @click="handleEdit(record.tableId)">编辑</a>
        <a-divider type="vertical" />
        <a v-if="removeEnable" @click="delByIds([record.tableId])">删除</a>
        <a-divider type="vertical" />
        <a v-if="codeEnable" @click="handleGen([record.tableName])">生成代码</a>
      </span>
    </s-table>
    <db-list-modal ref="dbmodal" @ok="handleOk" />
    <preview-modal ref="premodal" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getGenList, delGen, batchGenCode } from '@/api/gen'
import { checkPermission } from '@/utils/permissions'
import DbListModal from './modules/DbListModal.vue'
import PreviewModal from './modules/PreviewModal.vue'
import { genCodeZip } from '@/utils/download'
const commonStatusMap = {}
export default {
  name: 'TableList',
  components: {
    STable,
    DbListModal,
    PreviewModal
  },
  data () {
    return {
      description: '代码生成工具，先导入，再生成',
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
          title: '实体类名称',
          dataIndex: 'className'
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
        },
        {
          title: '操作',
          width: '240px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      range: null,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getGenList(Object.assign(parameter, this.queryParam))
      },
      commonStatus: [],
      selectedRowKeys: [],
      selectedRows: [],
      codeEnable: checkPermission('tool:gen:code'),
      editEnable: checkPermission('tool:gen:edit'),
      removeEnable: checkPermission('tool:gen:remove')

    }
  },
  filters: {
    operTypeFilter (type) {
      return commonStatusMap[type].text
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
  created () {
  },
  methods: {
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    lead () {
      this.$refs.dbmodal.show()
    },
    handleEdit (tableId) {
      this.$router.push({ name: 'genEdit', query: { tableId: tableId } })
    },
    handlePreview (tableId) {
      this.$refs.premodal.show(tableId)
    },
    batchGen () {
      const tables = this.selectedRows.map(t => {
        return t.tableName
      })
      this.handleGen(tables)
    },
    handleGen (tables) {
      genCodeZip(batchGenCode, tables.join(','))
    },
    handleOk () {
      this.$refs.table.refresh(true)
    },
    delByIds (ids) {
      delGen({ ids: ids.join(',') }).then(res => {
        if (res.code === 0) {
          this.$message.success(`删除成功`)
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
