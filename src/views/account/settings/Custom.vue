<template>
  <a-list itemLayout="horizontal">
    <a-list-item>
      <a-list-item-meta>
        <template v-slot:title>
          <a>风格配色</a>
        </template>
        <template v-slot:description>
          <span>
            整体风格配色设置
          </span>
        </template>
      </a-list-item-meta>
      <template v-slot:actions>
        <a-switch checkedChildren="暗色" unCheckedChildren="白色" :defaultChecked="navTheme === 'dark' && true || false" @change="onChange" />
      </template>
    </a-list-item>
    <a-list-item>
      <a-list-item-meta>
        <a slot="title">主题色</a>
        <span slot="description">
          页面风格配色： <a>{{ colorFilter(this.primaryColor) }}</a>
        </span>
      </a-list-item-meta>
      <template v-slot:actions>
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
      </template>
    </a-list-item>
  </a-list>
</template>
<script>
import { updateTheme, colorList } from '@/components/SettingDrawer/settingConfig'
import { baseMixin } from '@/store/app-mixin'
import { NAV_THEME, TOGGLE_NAV_THEME, TOGGLE_COLOR } from '@/store/mutation-types'

const themeMap = {
  'dark': '暗色',
  'light': '白色'
}

export default {
  mixins: [baseMixin],
  data () {
    return {
      colorList
    }
  },
  filters: {
    themeFilter (theme) {
      return themeMap[theme]
    }
  },
  created () {
  },
  methods: {
    colorFilter (color) {
      const c = colorList.find(o => o.color === color)
      return c && c.key
    },

    onChange (checked) {
      if (checked) {
        this.$store.commit(TOGGLE_NAV_THEME, NAV_THEME.DARK)
      } else {
        this.$store.commit(TOGGLE_NAV_THEME, NAV_THEME.LIGHT)
      }
    },
    changeColor (color) {
      if (this.primaryColor !== color) {
        this.$store.commit(TOGGLE_COLOR, color)
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
