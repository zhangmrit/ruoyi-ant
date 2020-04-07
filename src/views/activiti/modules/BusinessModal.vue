<template>
  <a-modal title="操作" style="top: 20px;" :width="800" v-model="visible" :footer="null">
    <a-list rowKey="id" :grid="{gutter: 24, lg: 3, md: 2, sm: 1, xs: 1}" :dataSource="profList">
      <a-list-item slot="renderItem" slot-scope="item,index" @click="handelClick(item)">
        <a-card :hoverable="true">
          <a-card-meta>
            <a slot="title">{{ (index+1)+'.'+item.name }}</a>
            <div class="meta-content" slot="description">
              <p>{{ item.description }}</p>
              <p>版本:v{{ item.version }}</p>
            </div>
          </a-card-meta>
        </a-card>
      </a-list-item>
    </a-list>
  </a-modal>
</template>
<script>
import { getProfAllLatest, routerMap } from '@/api/activiti'
export default {
  name: 'ActBusinessModal',
  props: {},
  components: {},
  data () {
    return {
      visible: false,
      profList: []
    }
  },
  beforeCreate () {},
  created () {
    getProfAllLatest().then(res => {
      this.profList = res.rows.map(r => {
        return r
      })
    })
  },
  methods: {
    add () {
      this.visible = true
    },
    handelClick (prof) {
      const router = routerMap[prof.key]
      if (router) {
        this.visible = false
        this.$router.push({ name: router, query: { key: prof.key, procDefId: prof.id, procName: prof.name } })
      } else {
        this.$message.error('路由配置错误')
      }
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
