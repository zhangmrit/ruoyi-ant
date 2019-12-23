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
      <h3 style="margin: 12px 26px">11️月份‎的橙子清爽多‎汁，吃出初‎恋的味道，有点青涩，我本人喜欢酸酸甜甜的。12‎️月份的橙‎子就像‎热恋期，‎吃到停‎不下嘴。昼‎夜温差越来越明显促使‎橙‎子‎甜度不‎断上升，喜欢‎初恋还是热恋呢！你说了算</h3>
      <h4 style="margin: 12px 26px">全国可发快递直接送到你手中，九省包邮：<span style="color:red">江西、广东、福建、江苏、上海、安徽、湖南、湖北、浙江</span> 其他地区补运费差价</h4>
      <h4 style="margin: 12px 26px">可以指定大小，默认推荐75-80规格</h4>
      <h2 style="margin: 12px 26px">价格：10斤装/78 20斤装/128</h2>
      <h3 style="margin: 12px 26px"><a-icon type="qq" />QQ群：<a href="https://jq.qq.com/?_wv=1027&k=5JGXHPD" target="_blank"><a-button type="primary" size="small">755109875</a-button></a> 点击按钮入群，备注橙子</h3>
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
      description: '表姐家的赣南脐橙，果园直发，我自己每年吃10几箱大的，即将下市，要吃抓紧了',
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
        'http://tva1.sinaimg.cn/large/007X8olVly1g8xkolvonij30sa0l8jtk.jpg',
        'http://tva1.sinaimg.cn/large/007X8olVly1g8xkp2zv5zj30rs112add.jpg',
        'http://tva1.sinaimg.cn/large/007X8olVly1g8xkpd0ofjj31400u041c.jpg',
        'http://tva1.sinaimg.cn/large/007X8olVly1g8xkpjns51j30m80m80ve.jpg'
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
