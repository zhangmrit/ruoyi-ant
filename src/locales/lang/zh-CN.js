import { locales } from 'ant-design-vue'
import momentCN from 'moment/locale/zh-cn'
const zhCN = locales.zh_CN
const components = {
  antLocale: zhCN,
  momentName: 'zh-cn',
  momentLocale: momentCN
}

const locale = {
  'message': '-',
  'menu.home': '主页',
  'menu.dashboard': '仪表盘',
  'menu.dashboard.analysis': '分析页',
  'menu.dashboard.weclome': '欢迎页',
  'menu.dashboard.monitor': '监控页',
  'menu.dashboard.workplace': '工作台',

  'app.setting.pagestyle': '整体风格设置',
  'app.setting.pagestyle.light': '亮色菜单风格',
  'app.setting.pagestyle.dark': '暗色菜单风格',
  'app.setting.pagestyle.realdark': '纯黑',
  'app.setting.themecolor': '主题色',
  'app.setting.navigationmode': '导航模式',
  'app.setting.content-width': '内容区域宽度',
  'app.setting.fixedheader': '固定 Header',
  'app.setting.fixedsidebar': '固定侧边菜单',
  'app.setting.sidemenu': '侧边栏导航',
  'app.setting.topmenu': ' 顶部栏导航',
  'app.setting.content-width.fixed': '固定',
  'app.setting.content-width.fluid': '流式',
  'app.setting.othersettings': '其他设置',
  'app.setting.weakmode': '色弱模式',
  'app.setting.copy': '拷贝设置',
  'app.setting.loading': '主题加载中',
  'app.setting.copyinfo': '复制成功，替换src/config/defaultSettings.js文件中的配置',
  'app.setting.production.hint': '配置栏只在开发环境用于预览，生产环境不会展现，请手动修改配置文件。',

  'app.setting.themecolor.daybreak': '拂晓蓝（默认）',
  'app.setting.themecolor.dust': '薄暮',
  'app.setting.themecolor.volcano': '火山',
  'app.setting.themecolor.sunset': '日暮',
  'app.setting.themecolor.cyan': '明青',
  'app.setting.themecolor.green': '极光绿',
  'app.setting.themecolor.geekblue': '极客蓝',
  'app.setting.themecolor.purple': '酱紫'
}

export default {
  ...components,
  ...locale
}
