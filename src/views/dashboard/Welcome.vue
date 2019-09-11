<template>
  <page-view :avatar="avatar" :title="false">
    <div slot="headerContent">
      <div class="title">{{ timeFix }}，{{ user.userName }}<span class="welcome-text">，{{ welcome }}</span></div>
      <div>前端工程师 | 蚂蚁金服 - 某某某事业群 - VUE平台</div>
    </div>
    <div slot="extra">
      <a-row class="more-info">
        <a-col :span="8">
          <head-info :title="$t('dashboard.workplace.project')" content="56" :center="false" :bordered="false"/>
        </a-col>
        <a-col :span="8">
          <head-info :title="$t('dashboard.workplace.teamRank')" content="8/24" :center="false" :bordered="false"/>
        </a-col>
        <a-col :span="8">
          <head-info :title="$t('dashboard.workplace.views')" content="2,223" :center="false" />
        </a-col>
      </a-row>
    </div>

    <div>
      <a-row :gutter="24">
        <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card :bordered="false" title="RuoYi Cloud">
            <p><strong>Spring Cloud</strong> 版本的若依,集成 <strong>Spring Cloud</strong> 的几大神兽: <strong>eureka,gateway,hystrix,feign,config... </strong>自定义token实现授权，直接存到redis</p>
            <p><strong>文档地址 </strong><a href="http://doc.rycloud.zmrit.com" target="_blank">http://doc.rycloud.zmrit.com</a></p>
            <p><strong>RuoYi Cloud</strong> 承诺永久开源，不会出商业版之类的东西</p>
            <p><strong>RuoYi Cloud</strong> 是采用 MIT 许可的开源项目，使用完全免费。 但为了项目能够健康持续的发展下去，我们期望获得相应的资金支持。 你可以通过下列的方法来赞助我们的开发。</p>
            <ul>
              <li><h3>一次性赞助</h3></li>
              <p>捐赠者信息将会在文档捐赠页展示</p>
              <li><h3>周期性赞助</h3></li>
              <p>周期性赞助可以获得额外的回报，比如你的名字会出现在 GitHub 仓库中，再比如你的公司 logo 会出现在我们的官网上</p>
            </ul>
            <p><strong>Spring Cloud 从零开始免费教程 </strong><a href="http://club.zmrit.com/cloud-zero/" target="_blank">http://club.zmrit.com/cloud-zero/</a></p>
          </a-card>

          <a-card title="更新日志" :bordered="false">
            <a-timeline mode="left">
              <a-timeline-item :color="item.color" :key="index" v-for="(item, index) in changeList">
                <p><strong>{{ item.title }}</strong></p>
                <p :key="i" v-for="(c, i) in item.list" class="changList">{{ c }}</p>
              </a-timeline-item>
            </a-timeline>
          </a-card>
        </a-col>
        <a-col
          style="padding: 0 12px"
          :xl="8"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24">
          <a-card title="捐赠" style="margin-bottom: 24px" :bordered="false" :body-style="{padding: 0}">
            <h3 style="margin: 12px 26px">请作者喝杯咖啡或者建设演示服务器</h3>
            <img style="width:100%" src="https://gitee.com/zhangmrit/img/raw/master/contribute/donate.png"/>
          </a-card>
          <!-- <a-card title="更新日志" style="margin-bottom: 24px" :bordered="false" :body-style="{padding: 0}">
            <a-collapse defaultActiveKey="0" accordion :bordered="false">
              <a-collapse-panel :header="item.title" :key="index" v-for="(item, index) in changeList">
                <p :key="i" v-for="(c, i) in item.list">{{ c }}</p>
              </a-collapse-panel>
            </a-collapse>
          </a-card> -->
          <a-card title="联系信息" :bordered="false" >
            <a-row>
              <a-col :span="4"><a-icon type="qq" />QQ群：</a-col>
              <a-col :span="20"><a href="https://jq.qq.com/?_wv=1027&k=5JGXHPD" target="_blank"><a-button type="primary" size="small">755109875</a-button></a> 点击按钮入群</a-col>
            </a-row>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </page-view>
</template>

<script>
import { timeFix } from '@/utils/util'
import { mapState } from 'vuex'
import { PageView } from '@/layouts'
import HeadInfo from '@/components/tools/HeadInfo'
import DetailList from '@/components/tools/DetailList'
import { getRoleList, getServiceList } from '@/api/manage'
import { Radar } from '@/components'
import { Timeline } from 'ant-design-vue'
const TimelineItem = Timeline.Item
const DetailListItem = DetailList.Item
const DataSet = require('@antv/data-set')

export default {
  name: 'Workplace',
  components: {
    PageView,
    HeadInfo,
    DetailListItem,
    TimelineItem,
    Radar
  },
  data () {
    return {
      timeFix: timeFix(),
      avatar: '',
      user: {},

      projects: [],
      loading: true,
      radarLoading: true,
      activities: [],
      teams: [],

      // data
      axis1Opts: {
        dataKey: 'item',
        line: null,
        tickLine: null,
        grid: {
          lineStyle: {
            lineDash: null
          },
          hideFirstLine: false
        }
      },
      axis2Opts: {
        dataKey: 'score',
        line: null,
        tickLine: null,
        grid: {
          type: 'polygon',
          lineStyle: {
            lineDash: null
          }
        }
      },
      scale: [{
        dataKey: 'score',
        min: 0,
        max: 80
      }],
      axisData: [
        { item: '引用', a: 70, b: 30, c: 40 },
        { item: '口碑', a: 60, b: 70, c: 40 },
        { item: '产量', a: 50, b: 60, c: 40 },
        { item: '贡献', a: 40, b: 50, c: 40 },
        { item: '热度', a: 60, b: 70, c: 40 },
        { item: '引用', a: 70, b: 50, c: 40 }
      ],
      changeList: [
        { title: '1.0.2-SNAPSHOT(未发布)',
          color: 'red',
          list: [
            '代码生成模板适配vue',
            '分布式文件系统',
            '修复代码生成前缀无法自动去除',
            '操作日志增加请求方法',
            '移除jwt依赖',
            'swagger接口文档支持',
            '前端i18n国际化支持',
            '增加vue代码生成（部分）',
            'vue-cropper头像组件'
          ]
        },
        { title: '1.0.1-SNAPSHOT 2019-08-23',
          color: 'green',
          list: [
            '新增ruoyi 4.0代码生成功能，未修改模板',
            '修复数据权限导致不能分页的bug',
            '增加oss文件上传',
            '增加参数配置管理',
            '升级spring-alibaba-cloud版本到2.1.x',
            '优化读写分离逻辑'
          ]
        },
        { title: '1.0.0-SNAPSHOT 2019-07-25',
          color: 'green',
          list: [
            'maven坐标修改为com.ruoyi.cloud',
            '升级springboot版本到2.1.6',
            '升级springcloud版本到Greenwich.SR2',
            '用户管理部门不应该选中父节点',
            '菜单授权联动bug（受限于ant-design）,取消父子联动',
            '数据权限',
            '移除多余的依赖声明',
            '增加vue代码生成（部分）',
            '修复登陆记录调取token的bug'
          ]
        }
      ],
      radarData: []
    }
  },
  computed: {
    ...mapState({
      nickname: (state) => state.user.nickname,
      welcome: (state) => state.user.welcome
    }),
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {
    this.user = this.userInfo
    this.avatar = this.userInfo.avatar

    getRoleList().then(res => {
      // console.log('workplace -> call getRoleList()', res)
    })

    getServiceList().then(res => {
      // console.log('workplace -> call getServiceList()', res)
    })
  },
  mounted () {
    this.getTeams()
    this.initRadar()
  },
  methods: {
    getTeams () {
      this.$http.get('/workplace/teams')
        .then(res => {
          this.teams = res.result
          this.loading = false
        })
    },
    initRadar () {
      this.radarLoading = true

      this.$http.get('/workplace/radar')
        .then(res => {
          const dv = new DataSet.View().source(res.result)
          dv.transform({
            type: 'fold',
            fields: ['个人', '团队', '部门'],
            key: 'user',
            value: 'score'
          })

          this.radarData = dv.rows
          this.radarLoading = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
.changList{
  margin-top: -14px;
}
.members {
    a {
      display: block;
      margin: 12px 0;
      line-height: 24px;
      height: 24px;
      .member {
        font-size: 14px;
        color: rgba(0, 0, 0, .65);
        line-height: 24px;
        max-width: 100px;
        vertical-align: top;
        margin-left: 12px;
        transition: all 0.3s;
        display: inline-block;
      }
      &:hover {
        span {
          color: #1890ff;
        }
      }
    }
  }
</style>
