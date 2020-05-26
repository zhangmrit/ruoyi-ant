<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="流程定义key">
              <a-input placeholder="请输入" v-model="queryParam.key" allowClear/>
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
      <a-button v-if="removeEnable" :disabled="selectedRowKeys.length===0" type="danger" icon="delete" @click="delByIds(selectedRowKeys)">删除</a-button>
      <a-upload
        v-if="addEnable"
        name="file"
        :action="uploadUrl"
        :headers="headers"
        :showUploadList="false"
        @change="uploadChange"
      >
        <a-button icon="upload">部署流程文件</a-button>
      </a-upload>
    </div>
    <s-table
      size="default"
      ref="table"
      rowKey="deploymentId"
      :rowSelection="rowSelection"
      :columns="columns"
      :data="loadData"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="resourceName" slot-scope="text, record">
        <a @click="handleModelXml(record)">{{ text }}</a>
      </span>
      <span slot="dgrmResourceName" slot-scope="text, record">
        <a @click="handleShowImage(record.deploymentId)">{{ text }}</a>
      </span>
      <span slot="action" slot-scope="text, record">

        <a-popconfirm
          placement="topRight"
          title="该操作会一并 激活/挂起 所有流程实例?"
          @confirm="handleState(record)"
          okText="是"
          cancelText="否"
          v-if="editEnabel"
        >
          <a-icon slot="icon" type="question-circle-o" style="color: red" />
          <a >{{ record.suspensionState===1?'挂起':'激活' }}</a>
        </a-popconfirm>
        <a-divider v-if="editEnabel" type="vertical" />
        <a v-if="editEnabel" @click="handleNode(record.id)">节点配置</a>
        <a-divider v-if="removeEnable" type="vertical" />
        <a v-if="removeEnable" @click="delByIds([record.deploymentId])">删除</a>
      </span>
    </s-table>
    <a-modal :visible="previewVisible" :width="900" :footer="null" @cancel="previewCancel">
      <img style="width: 100%" :src="previewImage" />
    </a-modal>
  </a-card>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { STable } from '@/components'
// eslint-disable-next-line no-unused-vars
import { getProfList, delProf, diagram, modelXml, processState, deployByFileURL } from '@/api/activiti'
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
          title: '#',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '名称',
          dataIndex: 'name'
        },
        {
          title: '流程定义key',
          dataIndex: 'key'
        },
        {
          title: '版本',
          dataIndex: 'version'
        },
        {
          title: '部署ID',
          dataIndex: 'deploymentId'
        },
        {
          title: '资源名称',
          dataIndex: 'resourceName',
          scopedSlots: { customRender: 'resourceName' }
        },
        {
          title: '流程图名称',
          dataIndex: 'dgrmResourceName',
          scopedSlots: { customRender: 'dgrmResourceName' }
        },
        {
          title: '操作',
          width: '200px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getProfList(Object.assign(parameter, this.queryParam))
      },
      previewVisible: false,
      previewImage: '',
      uploadUrl: process.env.VUE_APP_API_BASE_URL + deployByFileURL,
      headers: {
        token: Vue.ls.get(ACCESS_TOKEN)
      },
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
  },
  created () {
  },
  methods: {
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    handleNode (procDefId) {
      this.$router.push({ name: 'procDefNode', query: { procDefId: procDefId } })
    },
    handleOk () {
      this.$refs.table.refresh(true)
      console.log('handleSaveOk')
    },
    dataModal (dictType) {
      this.$refs.datamodal.show(dictType)
    },
    previewCancel () {
      this.previewVisible = false
    },
    handleShowImage (did) {
      diagram(did).then(res => {
        const raw = res.data
        this.previewImage = URL.createObjectURL(raw)
      })
      this.previewVisible = true
    },
    uploadChange (info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        this.$refs.table.refresh(true)
      }
    },
    handleModelXml (record) {
      modelXml(record.deploymentId).then(res => {
        const aLink = document.createElement('a')
        var blob = new Blob([res.data], { type: 'application/xml' })
        var fileName = record.resourceName
        aLink.href = URL.createObjectURL(blob)
        aLink.setAttribute('download', fileName) // 设置下载文件名称
        document.body.appendChild(aLink)
        aLink.click()
        document.body.removeChild(aLink)
        window.URL.revokeObjectURL(aLink.href)
      })
    },
    handleState (record) {
      const state = record.suspensionState === 1 ? 'suspend' : 'active'
      processState(record.id, state).then(res => {
        if (res.code === 0) {
          record.suspensionState = record.suspensionState === 1 ? 2 : 1
        }
      })
    },
    delByIds (ids) {
      this.$message.error('演示环境无法操作')
      // delProf({ ids: ids.join(',') }).then(res => {
      //   if (res.code === 0) {
      //     this.$message.success(`删除成功`)
      //     this.handleOk()
      //     this.selectedRowKeys = []
      //   } else {
      //     this.$message.error(res.msg)
      //   }
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
