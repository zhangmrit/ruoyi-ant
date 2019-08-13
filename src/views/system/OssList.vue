<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="4" :sm="12">
            <a-form-item label="文件名：">
              <a-input placeholder="请输入" v-model="queryParam.fileName"/>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="12">
            <a-form-item label="文件后缀：">
              <a-input placeholder="请输入" v-model="queryParam.fileSuffix"/>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="12">
            <a-form-item label="上传人：">
              <a-input placeholder="请输入" v-model="queryParam.createBy"/>
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

      <a-button v-if="configEnabel" type="primary" icon="setting" @click="$refs.modal.config()">云存储配置</a-button>
      <a-dropdown v-if="removeEnable && selectedRowKeys.length > 0">
        <a-button type="danger" icon="delete" @click="delByIds(selectedRowKeys)">删除</a-button>
      </a-dropdown>
      <a-upload
        v-if="addEnable"
        name="file"
        :action="uploadUrl"
        :headers="headers"
        :showUploadList="false"
        @change="handleChange"
      >
        <a-button icon="upload"> 文件上传</a-button>
      </a-upload>
    </div>
    <s-table
      size="default"
      ref="table"
      rowKey="ossId"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :columns="columns"
      :data="loadData"
      :rangPicker="range"
      defaultSort="createTime"
    >
      <span slot="service" slot-scope="text">
        {{ text | serviceFilter }}
      </span>
      <img style="width:30px;heigth:30px" slot="url" slot-scope="text" :src="text" />
      <span slot="action" slot-scope="text, record">
        <a v-if="editEnabel" @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a v-if="removeEnable" @click="delByIds([record.id])">删除</a>
      </span>
    </s-table>
    <oss-modal ref="modal" @ok="handleOk"/>
  </a-card>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { STable, Ellipsis } from '@/components'
import { getOssList, delOss } from '@/api/system'
import { checkPermission } from '@/utils/permissions'
import OssModal from './modules/OssConfigModal'
export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    OssModal
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
          title: '文件编号',
          dataIndex: 'id'
        },
        {
          title: '文件名',
          dataIndex: 'fileName'
        },
        {
          title: '文件后缀',
          dataIndex: 'fileSuffix'
        },
        {
          title: '文件预览',
          dataIndex: 'url',
          scopedSlots: { customRender: 'url' }
        },

        {
          title: '上传人',
          dataIndex: 'createBy'
        },
        {
          title: '服务商',
          dataIndex: 'service',
          scopedSlots: { customRender: 'service' }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      range: null,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getOssList(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: [],
      uploadUrl: process.env.VUE_APP_API_BASE_URL + '/system/oss/upload',
      headers: {
        token: Vue.ls.get(ACCESS_TOKEN)
      },
      addEnable: checkPermission('system:oss:add'),
      editEnabel: checkPermission('system:oss:edit'),
      configEnabel: checkPermission('system:oss:config'),
      removeEnable: checkPermission('system:oss:remove')

    }
  },
  filters: {
    serviceFilter (service) {
      const serviceMap = {
        1: '七牛云',
        2: '阿里云',
        3: '腾讯云'
      }
      return serviceMap[service]
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
      console.log(this.selectedRowKeys)
      console.log(this.selectedRows)
    },
    handleChange (info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        this.$refs.table.refresh(true)
      }
    },
    handleOk () {
      this.$refs.table.refresh(true)
    },
    handleEdit (record) {
      this.$refs.modal.edit(record)
    },
    delByIds (ids) {
      delOss({ ids: ids.join(',') }).then(res => {
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
