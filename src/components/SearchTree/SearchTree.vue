<template>
  <div>
    <a-input style="margin-bottom: 8px" :placeholder="holderText" v-model="searchValue" @change="handleChange" ref="searchInput" >
      <a-icon slot="prefix" type="search" />
      <a-icon v-if="searchValue" slot="suffix" type="close-circle" @click="emitEmpty" />
    </a-input>
    <a-tree
      v-if="treeData.length>0"
      :treeData="treeData"
      @expand="onExpand"
      :expandedKeys="expandedKeys"
      :autoExpandParent="autoExpandParent"
      @select="handleSelect">
      <template slot="title" slot-scope="{title}">
        <span v-if="title.indexOf(searchValue) > -1">
          {{ title.substr(0, title.indexOf(searchValue)) }}
          <span style="color: red">{{ searchValue }}</span>
          {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
        </span>
        <span v-else>{{ title }}</span>
      </template>
    </a-tree>
  </div>
</template>

<script>
import { Tree } from 'ant-design-vue'

export default {
  name: 'SearchTree',
  components: {
    Tree
  },
  props: {
    // 搜索框提示语
    holderText: {
      type: String,
      default: '搜索'
    },
    // 树数据，树型结构
    treeData: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 展开的键
    expandedKeys: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 用来检索的数据，线性结构
    dataList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      searchValue: '',
      autoExpandParent: true
    }
  },
  created () {
  },
  methods: {
    // 下面是树相关方法
    onExpand  (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    emitEmpty () {
      this.$refs.searchInput.focus()
      this.searchValue = ''
      this.searchDept()
    },
    getParentKey (key, tree) {
      let parentKey
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i]
        if (node.children) {
          if (node.children.some(item => item.key === key)) {
            parentKey = node.key
          } else if (this.getParentKey(key, node.children)) {
            parentKey = this.getParentKey(key, node.children)
          }
        }
      }
      return parentKey
    },
    handleChange (e) {
      this.searchDept()
    },
    searchDept () {
      const value = this.searchValue
      const expandedKeys = this.dataList.map((item) => {
        if (item.title.indexOf(value) > -1) {
          const parentKey = this.getParentKey(item.key, this.treeData)
          return parentKey
        }
        return null
      }).filter((item, i, self) => item && self.indexOf(item) === i)
      Object.assign(this, {
        expandedKeys,
        autoExpandParent: true
      })
    },
    handleSelect (selectedKeys, info) {
      this.$emit('select', selectedKeys, info)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
