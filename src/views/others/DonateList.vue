<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="昵称">
              <a-input placeholder="请输入" v-model="queryParam.nick"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="渠道">
              <a-select placeholder="请选择" v-model="queryParam.canal">
                <a-select-option :value="''">所有</a-select-option>
                <a-select-option v-for="(c, index) in canals" :key="index" :value="c.value">{{ c.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="捐赠时间">
              <a-range-picker v-model="range"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
            </span>
          </a-col>
          <a-col :md="4" :sm="12">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="handlePreview">朕要扶贫</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button v-if="addEnable" type="primary" icon="plus" @click="$refs.modal.add()">新建</a-button>
      <a-dropdown v-if="removeEnable&&selectedRowKeys.length > 0">
        <a-button type="danger" icon="delete" @click="delByIds(selectedRowKeys)">删除</a-button>
      </a-dropdown>
    </div>
    <s-table
      size="default"
      ref="table"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :rangPicker="range"
      defaultSort="createTime"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="canal" slot-scope="text">
        <my-icon :type="text | canalIconFilter" /> {{ text | canalFilter }}
      </span>
      <div slot="footer" style="text-align: center;">
        当前金额合计： <a style="font-weight: 600">{{ '￥'+total }}</a>
      </div>
    </s-table>
    <a-modal :visible="previewVisible" :footer="null" @cancel="previewCancel">
      <img style="width: 100%" :src="previewImage" />
    </a-modal>
  </a-card>
</template>

<script>
import { Icon } from 'ant-design-vue'
import { STable } from '@/components'
import { getDonateList } from '@/api/donate'
const canalMap = {}
const MyIcon = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1574906_mvhehmkaer.js' // 在 iconfont.cn 上生成
})
export default {
  name: 'TableList',
  components: {
    STable,
    Icon,
    MyIcon
  },
  data () {
    return {
      description: '一直以来感谢众多朋友的支持，本页面还有一个自定义icon的小例子，外加表格底部自定义',
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
          title: '昵称',
          dataIndex: 'nick'
        },
        {
          title: '渠道',
          dataIndex: 'canal',
          scopedSlots: { customRender: 'canal' }
        },
        {
          title: '金额',
          dataIndex: 'amount',
          customRender: (text) => '￥' + text
        },
        {
          title: '备注',
          dataIndex: 'remark'
        },
        {
          title: '捐赠时间',
          dataIndex: 'createTime',
          sorter: true
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getDonateList(Object.assign(parameter, this.queryParam)).then(res => {
          const data = res.rows
          this.total = data.map(item => item.amount).reduce((total, amount) => total + amount)
          return res
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      range: null,
      previewVisible: false,
      previewImage: 'http://upload.ouliu.net/i/20191021180958e1ek5.png',
      total: 0,
      canals: [
        { value: 1, label: '支付宝', icon: 'icon-alipay' },
        { value: 2, label: '微信', icon: 'icon-we-chatpay' },
        { value: 3, label: '码云', icon: 'icon-gitee' }
      ]
    }
  },
  filters: {
    canalFilter (type) {
      return canalMap[type].text
    },
    canalIconFilter (type) {
      return canalMap[type].icon
    }
  },
  created () {
    this.canals.map(d => {
      canalMap[d.value] = { text: d.label, icon: d.icon }
    })
  },
  methods: {
    previewCancel () {
      this.previewVisible = false
    },
    handlePreview () {
      this.previewVisible = true
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    handleOk () {
      this.$refs.table.refresh(true)
      console.log('handleSaveOk')
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
