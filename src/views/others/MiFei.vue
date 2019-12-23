<template>
  <div>
    <a-card :bordered="false">

      <a-carousel arrows autoplay dotsClass="slick-dots slick-thumb">
        <a slot="customPaging" slot-scope="props">
          <img :src="getImgUrl(props.i)" />
        </a>
        <div v-for="(item,i) in imgs" :key="i">
          <img :src="item" style="max-height:400px;"/>
        </div>
      </a-carousel>
      <br/>
      <br/>
    </a-card>
    <a-card :bordered="false">
      <h2 style="text-align:center;">我这里最常用的就是纸尿裤和小猪佩奇的抽纸，其他产品有需要自己了解吧,下面是大全</h2>
      <img src="http://upload.ouliu.net/i/20191223143536spdmx.jpeg"/>
    </a-card>
  </div>
</template>

<script>
import { Icon, Carousel } from 'ant-design-vue'
import { STable } from '@/components'
const canalMap = {}
const MyIcon = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1574906_gf13b4kjq1u.js' // 在 iconfont.cn 上生成
})
export default {
  name: 'TableList',
  components: {
    STable,
    Icon,
    Carousel,
    MyIcon
  },
  data () {
    return {
      description: '家里宝宝降生以后接触了米菲，刚好朋友是米王，给了我一个米妃的代理帐号，自用省多了，由于米菲的价格保护措施，均以原价代购（米妃价），不赚差价，纯属福利（否则不按原价卖要被投诉的哈哈哈）',
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
      imgs: [
        'http://upload.ouliu.net/i/20191223133417z9kcx.jpeg',
        'http://upload.ouliu.net/i/20191223133628vyhy0.jpeg',
        'https://img.alicdn.com/imgextra/i4/2878843583/TB2vIqWcNUaBuNjt_iGXXXlkFXa_!!2878843583.jpg_430x430q90.jpg'
      ],
      selectedRowKeys: [],
      selectedRows: [],
      range: null,
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
    getImgUrl (i) {
      return this.imgs[i]
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
<style scoped>
  /* For demo */
  .ant-carousel >>> .slick-dots {
    height: auto;
  }
  .ant-carousel >>> .slick-slide img {
    border: 5px solid #fff;
    display: block;
    margin: auto;
    max-width: 80%;
  }
  .ant-carousel >>> .slick-thumb {
    bottom: -45px;
  }
  .ant-carousel >>> .slick-thumb li {
    width: 60px;
    height: 45px;
  }
  .ant-carousel >>> .slick-thumb li img {
    width: 100%;
    height: 100%;
    filter: grayscale(100%);
  }
  .ant-carousel >>> .slick-thumb li.slick-active img {
    filter: grayscale(0%);
  }
</style>
