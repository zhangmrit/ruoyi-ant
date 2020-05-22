import antdEnUS from 'ant-design-vue/es/locale-provider/en_US'
import momentEU from 'moment/locale/eu'

const components = {
  antLocale: antdEnUS,
  momentName: 'eu',
  momentLocale: momentEU
}

const locale = {
  'message': '-',
  'menu.home': 'Home',
  'menu.dashboard': 'Dashboard',
  'menu.dashboard.analysis': 'Analysis',
  'menu.dashboard.weclome': 'Weclome',
  'menu.dashboard.monitor': 'Monitor',
  'menu.dashboard.workplace': 'Workplace',
  'menu.form': 'Form',
  'menu.form.basic': 'BaseForm',
  'menu.form.step': 'StepForm',
  'menu.form.advanced': 'AdvancedForm',
  'menu.form.edit': 'EditorForm',
  'menu.list': 'List',
  'menu.list.table': 'tableList',
  'menu.list.standard': 'standardList',
  'menu.list.card': 'cardList',
  'menu.list.search': 'search',
  'menu.list.search.article': 'article',
  'menu.list.search.project': 'project',
  'menu.list.search.application': 'application',
  'menu.profile': 'profile',
  'menu.profile.basic': 'profileBasic',
  'menu.profile.advanced': 'profileAdvanced',
  'menu.result': 'Result',
  'menu.result.succ': 'Succ',
  'menu.result.err': 'Err',
  'menu.exception': 'exception',
  'menu.exception.403': '403',
  'menu.exception.404': '404',
  'menu.exception.500': '500',
  'menu.account': 'account',
  'menu.account.center': 'center',
  'menu.account.settings': 'settings',
  'menu.account.settings.base': 'base',
  'menu.account.settings.security': 'security',
  'menu.account.settings.custom': 'custom',
  'menu.account.settings.binding': 'binding',
  'menu.account.settings.notification': 'notification',

  'layouts.usermenu.dialog.title': 'Message',
  'layouts.usermenu.dialog.content': 'Do you really log-out.',

  'app.setting.pagestyle': 'Page style setting',
  'app.setting.pagestyle.light': 'Light style',
  'app.setting.pagestyle.dark': 'Dark style',
  'app.setting.pagestyle.realdark': 'RealDark style',
  'app.setting.themecolor': 'Theme Color',
  'app.setting.navigationmode': 'Navigation Mode',
  'app.setting.content-width': 'Content Width',
  'app.setting.fixedheader': 'Fixed Header',
  'app.setting.fixedsidebar': 'Fixed Sidebar',
  'app.setting.sidemenu': 'Side Menu Layout',
  'app.setting.topmenu': 'Top Menu Layout',
  'app.setting.content-width.fixed': 'Fixed',
  'app.setting.content-width.fluid': 'Fluid',
  'app.setting.othersettings': 'Other Settings',
  'app.setting.weakmode': 'Weak Mode',
  'app.setting.copy': 'Copy Setting',
  'app.setting.loading': 'Loading theme',
  'app.setting.copyinfo': 'copy success，please replace defaultSettings in src/models/setting.js',
  'app.setting.production.hint': 'Setting panel shows in development environment only, please manually modify',

  'app.setting.themecolor.daybreak': 'daybreak',
  'app.setting.themecolor.dust': 'dust',
  'app.setting.themecolor.volcano': 'volcano',
  'app.setting.themecolor.sunset': 'sunset',
  'app.setting.themecolor.cyan': 'cyan',
  'app.setting.themecolor.green': 'green',
  'app.setting.themecolor.geekblue': 'geekblue',
  'app.setting.themecolor.purple': 'purple'

}

export default {
  ...components,
  ...locale
}
