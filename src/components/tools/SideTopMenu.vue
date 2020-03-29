<template>
  <div class="side-top-wrapper">
    <div class="content-box">
      <a-menu
        mode="horizontal"
        @click="handleMenuClick"
        :defaultSelectedKeys="defaultSelectedKeys"
        :style="{ lineHeight: '64px' }"
      >
        <a-menu-item v-for="item in menus" v-if="!item.hidden" :value="item.path" :key="item.name"><a-icon :type="item.meta.icon" /><span>{{ item.meta.title }}</span></a-menu-item>
      </a-menu>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'SideTopMenu',
  props: {
    menus: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      defaultSelectedKeys: ['dashboard']
    }
  },
  components: {
  },
  computed: {
    ...mapState({
      menuKey: state => state.menu.menuKey
    })
  },
  watch: {
  },
  created () {
    this.defaultSelectedKeys[0] = this.menuKey
  },
  methods: {
    ...mapActions(['setMenuKey']),
    handleMenuClick (val) {
      console.log(val)
      this.setMenuKey(val.key)
    }
  }
}
</script>

<style lang="less" scoped>
  .header,
  .top-nav-header-index {
    .side-top-wrapper {
      float: left;
      height: 100%;

      .action {
        cursor: pointer;
        padding: 0 12px;
        display: inline-block;
        transition: all 0.3s;
        height: 100%;
        color: rgba(0, 0, 0, 0.65);

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }

        .avatar {
          margin: 20px 8px 20px 0;
          color: #1890ff;
          background: hsla(0, 0%, 100%, 0.85);
          vertical-align: middle;
        }

        .icon {
          font-size: 16px;
          padding: 4px;
        }
      }
    }

    &.dark {
      .side-top-wrapper {
        .action {
          color: rgba(255, 255, 255, 0.85);
          a {
            color: rgba(255, 255, 255, 0.85);
          }

          &:hover {
            background: rgba(255, 255, 255, 0.16);
          }
        }
      }
    }
  }
</style>
