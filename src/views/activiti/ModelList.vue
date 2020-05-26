<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="名称">
              <a-input placeholder="请输入" v-model="queryParam.name" allowClear/>
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
      <a-button v-if="addEnable" type="primary" icon="plus" @click="handleAdd">新建</a-button>
      <a-dropdown v-if="removeEnable&&selectedRowKeys.length > 0">
        <a-button type="danger" icon="delete" @click="delByIds(selectedRowKeys)">删除</a-button>
      </a-dropdown>
    </div>
    <s-table
      size="default"
      ref="table"
      rowKey="id"
      :rowSelection="rowSelection"
      :columns="columns"
      :data="loadData"
    >
      <span slot="action" slot-scope="text, record">
        <a v-if="editEnabel" @click="handleEdit(record.id)">编辑</a>
        <a-divider v-if="removeEnable&&record.deploymentId==null" type="vertical" />
        <a v-if="removeEnable&&record.deploymentId==null" @click="delByIds([record.id])">删除</a>
        <a-divider type="vertical" />
        <a v-if="removeEnable" @click="deploy(record.id)">发布</a>
      </span>
    </s-table>
    <a-modal
      :visible="modelVisible"
      title="Activiti工作流在线流程设计编辑"
      :footer="null"
      :width="1500"
      centered
      @cancel="modelCancel">
      <div style="position:relative;height: 100%;">
        <iframe
          id="iframe"
          :src="modelerUrl"
          frameborder="0"
          width="100%"
          height="720px"
          scrolling="auto"
        ></iframe>
        <Spin fix size="large" v-if="modelerLoading"></Spin>
      </div>
    </a-modal>
  </a-card>
</template>

<script>
import { STable } from '@/components'
// eslint-disable-next-line no-unused-vars
import { getModelList, delModel, deploy } from '@/api/activiti'
import { checkPermission } from '@/utils/permissions'
const modelerBaseUrl = process.env.VUE_APP_MODEL_BASE_URL
export default {
  name: 'ModelList',
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
          title: '编号',
          dataIndex: 'id'
        },
        {
          title: '名称',
          dataIndex: 'name'
        },
        {
          title: '版本',
          dataIndex: 'version'
        },
        {
          title: '发布编号',
          dataIndex: 'deploymentId'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        },
        {
          title: '最后时间',
          dataIndex: 'lastUpdateTime'
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
        return getModelList(Object.assign(parameter, this.queryParam))
      },
      modelVisible: false,
      selectedRowKeys: [],
      selectedRows: [],
      addEnable: checkPermission('activiti:models:add'),
      editEnabel: checkPermission('activiti:models:edit'),
      removeEnable: checkPermission('activiti:models:remove')
    }
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        getCheckboxProps: record => ({
          props: {
            disabled: record.deploymentId, // Column configuration not to be checked
            name: record.name
          }
        })
      }
    }
  },
  filters: {
  },
  created () {
  },
  methods: {
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    handleAdd () {
      this.modelVisible = true
      this.modelerUrl = modelerBaseUrl + '/models/newModel?time=' + new Date().getTime()
    },
    handleEdit (id) {
      this.modelVisible = true
      this.modelerUrl = modelerBaseUrl + '/modeler.html?modelId=' + id + '&time=' + new Date().getTime()
    },
    handleOk () {
      this.$refs.table.refresh(true)
      console.log('handleSaveOk')
    },
    dataModal (dictType) {
      this.$refs.datamodal.show(dictType)
    },
    modelCancel () {
      this.modelVisible = false
      this.handleOk()
    },
    deploy (id) {
      this.$message.error('演示环境无法操作')
      // deploy(id).then(res => {
      //   if (res.code === 0) {
      //     this.$message.success(`发布成功`)
      //     this.handleOk()
      //   } else {
      //     this.$message.error(res.msg)
      //   }
      // })
    },
    delByIds (ids) {
      delModel({ ids: ids.join(',') }).then(res => {
        if (res.code === 0) {
          this.$message.success(`删除成功`)
          this.handleOk()
        } else {
          this.$message.error(res.msg)
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
