<template>
  <a-card :bordered="false">
    <a-form @submit="handleSubmit" :form="form">
      <a-tabs @change="callback" defaultActiveKey="2" type="card">
        <a-tab-pane tab="基本信息" key="1">
          <basic-info-form ref="basicinfo" :showSubmit="false" :info="info" />
        </a-tab-pane>
        <a-tab-pane tab="字段信息" key="2">
          <a-table
            :pagination="false"
            :columns="columns"
            :dataSource="data"
            rowKey="columnId"
          >
            <span slot="serial" slot-scope="text, record, index">
              {{ index + 1 }}
            </span>
            <template slot="javaType" slot-scope="text, record">
              <a-select :value="text" style="width: 120px" @change="e => handleChange(e, record.columnId, 'javaType')">
                <a-select-option value="Long">Long</a-select-option>
                <a-select-option value="String">String</a-select-option>
                <a-select-option value="Ingeter">Ingeter</a-select-option>
                <a-select-option value="Double">Double</a-select-option>
                <a-select-option value="BigDecimal">BigDecimal</a-select-option>
                <a-select-option value="Date">Date</a-select-option>
              </a-select>
            </template>
            <template v-for="(coli, i) in ['columnComment','javaField','dictType']" :slot="coli" slot-scope="text, record">
              <a-input
                :key="coli"
                style="margin: -5px 0"
                :value="text"
                @change="e => handleChange(e.target.value, record.columnId, coli)"
              />
            </template>
            <template v-for="(col, i) in ['isInsert','isEdit','isList','isQuery','isRequired']" :slot="col" slot-scope="text, record">
              <a-checkbox :key="col" :defaultChecked="text==='1'" @change="e => handleChange(e.target.checked?'1':'0', record.columnId, col)"></a-checkbox>
            </template>

            <template slot="queryType" slot-scope="text,record">
              <a-select :value="text" style="width: 100px" @change="e => handleChange(e, record.columnId, 'queryType')">
                <a-select-option value="EQ">=</a-select-option>
                <a-select-option value="NE">!=</a-select-option>
                <a-select-option value="GT">&gt;</a-select-option>
                <a-select-option value="GTE">&gt;=</a-select-option>
                <a-select-option value="LT">&gt;</a-select-option>
                <a-select-option value="LTE">&gt;=</a-select-option>
                <a-select-option value="LIKE">LIKE</a-select-option>
                <a-select-option value="BETWEEN">BETWEEN</a-select-option>
              </a-select>
            </template>
            <template slot="htmlType" slot-scope="text,record">
              <a-select :value="text" style="width: 100px" @change="e => handleChange(e, record.columnId, 'htmlType')">
                <a-select-option value="input">文本框</a-select-option>
                <a-select-option value="textarea">文本域</a-select-option>
                <a-select-option value="select">下拉框</a-select-option>
                <a-select-option value="radio">单选框</a-select-option>
                <a-select-option value="checkbox">复选框</a-select-option>
                <a-select-option value="datetime">日期控件</a-select-option>
              </a-select>
            </template>
          </a-table>
          <br>
        </a-tab-pane>
        <a-tab-pane tab="生成信息" key="3">
          <gen-info-form ref="geninfo" :showSubmit="false" :info="info" />
        </a-tab-pane>
      </a-tabs>
      <a-form-item
        :wrapperCol="{ span: 24 }"
        style="text-align: center"
      >
        <a-button icon="check" type="primary" @click="validate" :loading="loading">提交</a-button>
        <a-button icon="rollback" style="margin-left: 8px" @click="rollback">关闭</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>
<script>
import { mapState } from 'vuex'
import BasicInfoForm from './modules/BasicInfoForm.vue'
import GenInfoForm from './modules/GenInfoForm.vue'
import { editGen, editSaveGen } from '@/api/gen'
export default {
  components: {
    BasicInfoForm,
    GenInfoForm
  },
  data () {
    return {
      // table
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '字段列名',
          dataIndex: 'columnName'
        },
        {
          title: '字段描述',
          dataIndex: 'columnComment',
          key: 'columnComment',
          width: '10%',
          scopedSlots: { customRender: 'columnComment' }
        },
        {
          title: '物理类型',
          dataIndex: 'columnType',
          scopedSlots: { customRender: 'columnType' }
        },
        {
          title: 'Java类型',
          dataIndex: 'javaType',
          key: 'javaType',
          scopedSlots: { customRender: 'javaType' }
        },
        {
          title: 'Java属性',
          dataIndex: 'javaField',
          key: 'javaField',
          width: '10%',
          scopedSlots: { customRender: 'javaField' }
        },
        {
          title: '插入',
          dataIndex: 'isInsert',
          key: 'isInsert',
          scopedSlots: { customRender: 'isInsert' }
        },
        {
          title: '编辑',
          dataIndex: 'isEdit',
          key: 'isEdit',
          scopedSlots: { customRender: 'isEdit' }
        },
        {
          title: '列表',
          dataIndex: 'isList',
          key: 'isList',
          scopedSlots: { customRender: 'isList' }
        },
        {
          title: '查询',
          dataIndex: 'isQuery',
          key: 'isQuery',
          scopedSlots: { customRender: 'isQuery' }
        },
        {
          title: '查询方式',
          dataIndex: 'queryType',
          key: 'queryType',
          scopedSlots: { customRender: 'queryType' }
        },
        {
          title: '必填',
          dataIndex: 'isRequired',
          key: 'isRequired',
          scopedSlots: { customRender: 'isRequired' }
        },
        {
          title: '显示类型',
          dataIndex: 'htmlType',
          key: 'htmlType',
          scopedSlots: { customRender: 'htmlType' }
        },
        {
          title: '字典类型',
          dataIndex: 'dictType',
          key: 'dictType',
          width: '10%',
          scopedSlots: { customRender: 'dictType' }
        }
      ],
      data: [],
      info: {},
      errors: [],
      loading: false,
      firstActed: true
    }
  },
  created () {
    this.handleInit()
  },
  activated () {
    if (this.firstActed) {
      this.firstActed = false
    } else {
      this.handleInit()
    }
  },
  computed: {
    ...mapState({
      multiTab: state => state.app.multiTab
    })
  },
  methods: {
    handleInit () {
      const { tableId } = this.$route.query
      if (tableId) {
        editGen({ tableId: tableId }).then(res => {
          this.data = res.rows
          this.info = res.data
        })
      }
    },
    handleChange (value, key, column) {
      console.log(value, key, column)
      const newData = [...this.data]
      const target = newData.filter(item => key === item.columnId)[0]
      if (target) {
        target[column] = value
        this.data = newData
      }
      // console.log(this.data)
    },
    callback (key) {
      // console.log(key)
    },

    // 最终全页面提交
    validate () {
      // eslint-disable-next-line no-debugger
      // debugger
      const forms = []
      const errors = {}
      const { $refs: { basicinfo, geninfo } } = this
      if (basicinfo) {
        const basicinfoForm = new Promise((resolve, reject) => {
          basicinfo.form.validateFields((err, values) => {
            if (err) {
              reject(err)
              return
            }
            resolve(values)
          })
        })
        forms.push(basicinfoForm)
        Object.assign(errors, basicinfo.form.getFieldsError())
      }
      if (geninfo) {
        const geninfoForm = new Promise((resolve, reject) => {
          geninfo.form.validateFields((err, values) => {
            if (err) {
              reject(err)
              return
            }
            resolve(values)
          })
        })
        forms.push(geninfoForm)
        Object.assign(errors, geninfo.form.getFieldsError())
      }

      // clean this.errors
      this.errors = []
      Promise.all(forms).then(values => {
        const genTable = Object.assign({}, this.info)
        values.forEach(i => {
          Object.assign(genTable, i)
        })
        this.info = Object.assign({}, genTable)
        genTable.columns = this.data
        genTable.params = { treeCode: genTable.treeCode, treeName: genTable.treeName, treeParentCode: genTable.treeParentCode }
        this.loading = true
        editSaveGen(genTable).then(res => {
          if (res.code === 0) {
            this.$message.success('保存成功')
            this.rollback()
          } else {
            this.$message.success(res.msg)
          }
        }).catch(() => {
          this.$message.error('系统错误，请稍后再试')
        }).finally(() => {
          this.loading = false
        })
        console.log('received values of form:', genTable)
      }).catch(() => {
        const tmp = { ...errors }
        this.errorList(tmp)
      })
    },
    errorList (errors) {
      if (!errors || errors.length === 0) {
        return
      }
      this.errors = Object.keys(errors)
        .filter(key => errors[key])
        .map(key => ({
          key: key,
          message: errors[key][0]
        }))
      console.log(this.errors)
      // 这里只输出第一个错误,需要自己改
      this.$message.error(this.errors[0].message || '配置错误')
    },
    rollback () {
      if (this.multiTab) {
        this.$multiTab.closeCurrentPage()
      }
      this.$router.push('/tool/gen')
    }
  }
}
</script>
