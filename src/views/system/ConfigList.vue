<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="4" :sm="12">
            <a-form-item label="参数名称">
              <a-input placeholder="请输入" v-model="queryParam.configName"/>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="12">
            <a-form-item label="参数键名">
              <a-input placeholder="请输入" v-model="queryParam.configKey"/>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="12">
            <a-form-item label="系统内置">
              <a-select placeholder="请选择" v-model="queryParam.configType" default-value="''">
                <a-select-option :value="''">全部</a-select-option>
                <a-select-option :value="'Y'">是</a-select-option>
                <a-select-option :value="'N'">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="18">
            <a-form-item label="创建时间">
              <a-range-picker v-model="range"/>
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
      <a-button v-if="addEnable" type="primary" icon="plus" @click="$refs.modal.add()">新建</a-button>
      <a-dropdown v-if="removeEnable && selectedRowKeys.length > 0">
        <a-button type="danger" icon="delete" @click="delByIds(selectedRowKeys)">删除</a-button>
      </a-dropdown>
    </div>
    <s-table
      size="default"
      ref="table"
      rowKey="configId"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :columns="columns"
      :data="loadData"
      :rangPicker="range"
      defaultSort="createTime"
    >
      <span slot="configType" slot-scope="text">
        {{ text | typeFilter }}
      </span>
      <span slot="configValue" slot-scope="text">
        <ellipsis :length="20" tooltip>{{ text }}</ellipsis>&nbsp;
        <a-tooltip>
          <template slot="title">
            复制
          </template>
          <a @click="docopy(text)"><a-icon type="copy"></a-icon></a>
        </a-tooltip>
      </span>
      <span slot="action" slot-scope="text, record">
        <a v-if="editEnabel" @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a v-if="removeEnable" @click="delByIds([record.configId])">删除</a>
      </span>
    </s-table>
    <config-modal ref="modal" @ok="handleOk"/>
  </a-card>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { getConfigList, delConfig } from '@/api/system'
import { checkPermission } from '@/utils/permissions'
import ConfigModal from './modules/ConfigModal'
export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    ConfigModal
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
          title: '参数主键',
          dataIndex: 'configId'
        },
        {
          title: '参数名称',
          dataIndex: 'configName'
        },
        {
          title: '参数键名',
          dataIndex: 'configKey'
        },
        {
          title: '参数键值',
          dataIndex: 'configValue',
          scopedSlots: { customRender: 'configValue' }
        },
        {
          title: '系统内置',
          dataIndex: 'configType',
          scopedSlots: { customRender: 'configType' }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          ellipsis: true
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
        return getConfigList(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: [],
      addEnable: checkPermission('system:config:add'),
      editEnabel: checkPermission('system:config:edit'),
      removeEnable: checkPermission('system:config:remove')

    }
  },
  filters: {
    typeFilter (type) {
      const typeMap = {
        'Y': '是',
        'N': '否'
      }
      return typeMap[type]
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
    handleOk () {
      this.$refs.table.refresh(true)
    },
    handleEdit (record) {
      this.$refs.modal.edit(record)
    },
    delByIds (ids) {
      delConfig({ ids: ids.join(',') }).then(res => {
        if (res.code === 0) {
          this.$message.success(`删除成功`)
          this.handleOk()
        } else {
          this.$message.error(res.msg)
        }
        this.selectedRowKeys = []
      })
    },
    docopy (text) {
      this.$copyText(text).then(message => {
        this.$message.success('复制完毕')
      }).catch(err => {
        console.log('copy.err', err)
        this.$message.error('复制失败')
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
