<template>

  <a-list itemLayout="horizontal">
    <a-list-item>
      <a-list-item-meta>
        <a slot="title">风格配色</a>
        <span slot="description">
          整体风格配色设置
        </span>
      </a-list-item-meta>
      <div slot="actions">
        <a-switch checkedChildren="暗色" unCheckedChildren="白色" :defaultChecked="navTheme=== 'dark'" @change="onChange" />
      </div>
    </a-list-item>
    <a-list-item>
      <a-list-item-meta>
        <a slot="title">主题色</a>
        <span slot="description">
          页面风格配色： <a>{{ this.colorFilter(this.primaryColor) }}</a>
        </span>
      </a-list-item-meta>
      <div style="height: 20px">
        <a-tooltip class="setting-drawer-theme-color-colorBlock" v-for="(item, index) in colorList" :key="index">
          <template slot="title">
            {{ item.key }}
          </template>
          <a-tag :color="item.color" @click="changeColor(item.color)">
            <a-icon type="check" v-if="item.color === primaryColor"></a-icon>
          </a-tag>
        </a-tooltip>
      </div>

    </a-list-item>
  </a-list>

</template>

<script>
import { updateTheme, colorList } from '@/components/SettingDrawer/settingConfig'
import { Switch as ASwitch, List as AList } from 'ant-design-vue'
import { mixin } from '@/utils/mixin'

const AListItem = AList.Item
const Meta = AListItem.Meta

export default {
  components: {
    AListItem,
    AList,
    ASwitch,
    Meta
  },
  mixins: [mixin],
  data () {
    return {
      colorList
    }
  },
  filters: {
    themeFilter (theme) {
      const themeMap = {
        'dark': '暗色',
        'light': '白色'
      }
      return themeMap[theme]
    }
  },
  methods: {
    colorFilter (color) {
      const c = colorList.find(o => o.color === color)
      return c && c.key
    },

    onChange (checked) {
      if (checked) {
        this.$store.dispatch('ToggleTheme', 'dark')
      } else {
        this.$store.dispatch('ToggleTheme', 'light')
      }
    },
    changeColor (color) {
      if (this.primaryColor !== color) {
        this.$store.dispatch('ToggleColor', color)
        updateTheme(color)
      }
    }
  }
}
</script>

<style lang="less" scoped>

    .setting-drawer-theme-color-colorBlock {
      width: 20px;
      height: 20px;
      border-radius: 2px;
      float: left;
      cursor: pointer;
      margin-right: 8px;
      padding-left: 0px;
      padding-right: 0px;
      text-align: center;
      color: #fff;
      font-weight: 700;

      i {
        font-size: 14px;
      }
    }

</style>
