<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="接口编码">
              <a-input placeholder="请输入接口编码" v-model="queryParam.key"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="访问地址">
              <a-input placeholder="请输入访问地址" v-model="queryParam.url"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="接口名称">
              <a-input placeholder="请输入接口名称" v-model="queryParam.name"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="接口分类">
              <a-input placeholder="请输入接口分类" v-model="queryParam.category"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="备注信息">
              <a-input placeholder="请输入备注信息" v-model="queryParam.remarks"/>
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
      <a-button v-if="addEnable" type="primary" icon="plus" @click="$refs.modal.add()">新建</a-button>
    </div>
    <s-table
      size="default"
      ref="table"
      rowKey="id"
      :columns="columns"
      :data="loadData">
      <span slot="category" slot-scope="text">
        {{ text | categoryFilter }}
      </span>
      <span slot="scriptType" slot-scope="text">
        {{ text | scriptTypeFilter }}
      </span>
      <span slot="resultType" slot-scope="text">
        {{ text | resultTypeFilter }}
      </span>
      <span slot="status" slot-scope="text">
        {{ text | statusFilter }}
      </span>
      <span slot="action" slot-scope="text, record">
        <a v-if="editEnabel" @click="handleEdit(record.id)">编辑</a>
        <a-divider type="vertical" />
        <a v-if="removeEnable" @click="delByIds([record.id])">删除</a>
      </span>
    </s-table>
    <define-modal ref="modal" @ok="handleOk"/>
  </a-card>
</template>

<script>
import { getDictArray } from '@/utils/dict'
import { STable } from '@/components'
import { getDefineList, delDefine } from '@/api/open-api/define'
import { checkPermission } from '@/utils/permissions'

const categoryMap = {}
const scriptTypeMap = {}
const resultTypeMap = {}
const httpMethodMap = {}
const statusMap = {}

export default {
  name: 'TableList',
  components: {
    STable
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
          title: '接口名称',
          dataIndex: 'name'
        },
        {
          title: '接口分类',
          dataIndex: 'category',
          scopedSlots: { customRender: 'category' }
        },
        {
          title: '接口编码',
          dataIndex: 'key'
        },
        {
          title: '访问地址',
          dataIndex: 'url'
        },
        {
          title: '数据源Id',
          dataIndex: 'dataSourceId'
        },
        {
          title: '脚本类型',
          dataIndex: 'scriptType',
          scopedSlots: { customRender: 'scriptType' }
        },
        {
          title: '返回结果类型',
          dataIndex: 'resultType',
          scopedSlots: { customRender: 'resultType' }
        },
        {
          title: '请求方式',
          dataIndex: 'httpMethod'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          width: '200px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: parameter => {
        return getDefineList(Object.assign(parameter, this.queryParam))
      },
      addEnable: checkPermission('open-api:define:add'),
      editEnabel: checkPermission('open-api:define:edit'),
      removeEnable: checkPermission('open-api:define:remove'),
      categoryMap,
      categoryArray: [],
      scriptTypeMap,
      scriptTypeArray: [],
      resultTypeMap,
      resultTypeArray: [],
      httpMethodMap,
      httpMethodArray: [],
      statusMap,
      statusArray: []
    }
  },
  filters: {
    categoryFilter (category) {
      return categoryMap[category] === undefined ? '' : categoryMap[category].text
    },
    scriptTypeFilter (scriptType) {
      return scriptTypeMap[scriptType] === undefined ? '' : scriptTypeMap[scriptType].text
    },
    resultTypeFilter (resultType) {
      return resultTypeMap[resultType] === undefined ? '' : resultTypeMap[resultType].text
    },
    statusFilter (status) {
      return statusMap[status] === undefined ? '' : statusMap[status].text
    }

  },
  beforeCreate () {
  },
  async created () {
    this.categoryArray = getDictArray('define_category').then(res => {
      res.map(d => {
        categoryMap[d.dictValue] = { text: d.dictLabel }
      })
    }).then(
      this.scriptTypeArray = getDictArray('define_script_type').then(res => {
        res.map(d => {
          scriptTypeMap[d.dictValue] = { text: d.dictLabel }
        })
      })
    ).then(
      this.resultTypeArray = getDictArray('define_result_type').then(res => {
        res.map(d => {
          resultTypeMap[d.dictValue] = { text: d.dictLabel }
        })
      })
    ).then(
      this.httpMethodArray = getDictArray('define_http_method').then(res => {
        res.map(d => {
          httpMethodMap[d.dictValue] = { text: d.dictLabel }
        })
      })
    ).then(
      this.statusArray = getDictArray('define_status').then(res => {
        res.map(d => {
          statusMap[d.dictValue] = { text: d.dictLabel }
        })
      })
    )
  },
  methods: {
    handleAdd () {
      this.$router.push({ name: 'defineModal' })
    },
    handleEdit (apiId) {
      this.$router.push({ name: 'defineModal', query: { apiId: apiId } })
    },
    handleOk () {
      this.$refs.table.refresh(true)
    },
    delByIds (ids) {
      delDefine({ ids: ids.join(',') }).then(res => {
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
