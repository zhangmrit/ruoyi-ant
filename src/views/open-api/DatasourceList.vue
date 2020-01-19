<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="数据源名称">
              <a-input placeholder="请输入数据源名称" v-model="queryParam.name" />
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
    <s-table size="default" ref="table" rowKey="id" :columns="columns" :data="loadData">
      <span slot="action" slot-scope="text, record">
        <a v-if="editEnabel" @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a v-if="removeEnable" @click="delById(record.id)">删除</a>
      </span>
    </s-table>
    <datasource-modal ref="modal" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getDatasourceList, delDatasource } from '@/api/open-api/datasource'
import DatasourceModal from './modules/DatasourceModal.vue'
import { checkPermission } from '@/utils/permissions'

export default {
  name: 'TableList',
  components: {
    STable,
    DatasourceModal
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
          title: '名称',
          dataIndex: 'name'
        },
        {
          title: '连接地址',
          dataIndex: 'url'
        },
        {
          title: 'JDBC驱动',
          dataIndex: 'driverClassName'
        },
        {
          title: '用户名',
          dataIndex: 'username'
        },
        {
          title: '用户密码',
          dataIndex: 'password'
        },
        {
          title: '操作',
          width: '200px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: parameter => {
        return getDatasourceList(Object.assign(parameter, this.queryParam))
      },
      addEnable: checkPermission('open-api:datasource:add'),
      editEnabel: checkPermission('open-api:datasource:edit'),
      removeEnable: checkPermission('open-api:datasource:remove')
    }
  },
  filters: {},
  created () {},
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
      var self = this
      self.$confirm({
        title: '操作提示',
        content: '确认是否删除？',
        onOk () {
          delDatasource({ id: id }).then(res => {
            if (res.code === 0) {
              self.$message.success('删除成功')
              self.handleOk()
            } else {
              self.$message.error(res.msg)
            }
          })
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
