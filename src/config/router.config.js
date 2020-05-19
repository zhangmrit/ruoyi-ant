// eslint-disable-next-line
import { UserLayout, BlankLayout } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'
/**
 * 这里不再保留原来默认的菜单asyncRouterMap
 * https://github.com/sendya/ant-design-pro-vue/blob/master/src/router/generator-routers.js
 */
export const defaultRouterMap = [
  {
    'title': 'menu.dashboard',
    'key': 'dashboard',
    'component': 'RouteView',
    'redirect': '/dashboard/weclome',
    'icon': bxAnaalyse,
    'children': [{
      'title': 'menu.dashboard.analysis',
      'path': 'analysis/:pageNum([1-9]\\d*)?',
      'key': 'analysis',
      'icon': ''
    },
    {
      'title': 'menu.dashboard.weclome',
      'key': 'weclome',
      'icon': ''
    },
    {
      'title': 'menu.dashboard.workplace',
      'path': 'workplace',
      'key': 'workplace',
      'icon': ''
    }
    ]
  },
  {
    'title': '表单页',
    'key': 'form',
    'component': 'RouteView',
    'icon': 'form',
    'children': [
      {
        'title': '基础表单',
        'key': 'baseForm',
        'icon': ''
      },
      {
        'title': '分步表单',
        'key': 'stepForm',
        'icon': ''
      },
      {
        'title': '高级表单',
        'key': 'advancedForm',
        'icon': ''
      },
      {
        'title': '富文本',
        'key': 'editorForm',
        'icon': ''
      }
    ]
  },
  {
    'title': '列表页',
    'key': 'list',
    'component': 'RouteView',
    'icon': 'table',
    'children': [{
      'title': '查询表格',
      'key': 'tableList',
      'icon': ''
    },
    {
      'title': '标准列表',
      'key': 'standardList',
      'icon': ''
    },
    {
      'title': '卡片列表',
      'key': 'cardList',
      'icon': ''
    },
    {
      'title': '搜索列表',
      'redirect': '/list/search/article',
      'key': 'search',
      'children': [
        {
          'title': '搜索列表（文章）',
          'key': 'article'
        },
        {
          'title': '搜索列表（项目）',
          'key': 'project'
        },
        {
          'title': '搜索列表（应用）',
          'key': 'application'
        }
      ]
    }
    ]
  },
  {
    'title': '详情页',
    'key': 'profile',
    'component': 'RouteView',
    'icon': 'profile',
    'children': [{
      'title': '基础详情页',
      'key': 'profileBasic',
      'icon': ''
    },
    {
      'title': '高级详情页',
      'key': 'profileAdvanced',
      'icon': ''
    }
    ]
  },
  {
    'title': '结果页',
    'key': 'result',
    'component': 'RouteView',
    'icon': 'check-circle-o',
    'children': [{
      'hiddenHeaderContent': true,
      'title': '成功',
      'key': 'resultSucc',
      'icon': ''
    },
    {
      'hiddenHeaderContent': true,
      'title': '失败',
      'key': 'resultErr',
      'icon': ''
    }
    ]
  },
  {
    'title': '异常页',
    'key': 'exception',
    'component': 'RouteView',
    'icon': 'warning',
    'children': [
      {
        'hiddenHeaderContent': true,
        'title': '403',
        'key': 'error403'
      },
      {
        'hiddenHeaderContent': true,
        'title': '404',
        'key': 'error404'
      },
      {
        'hiddenHeaderContent': true,
        'title': '500',
        'key': 'error500'
      }
    ]
  },
  {
    'title': '个人页',
    'key': 'account',
    'component': 'RouteView',
    'icon': 'user',
    'children': [
      {
        'hiddenHeaderContent': true,
        'title': '个人中心',
        'key': 'center'
      },
      {
        'title': '个人设置',
        'key': 'settings',
        'hideChildrenInMenu': true,
        'redirect': '/account/settings/base',
        'children': [
          {
            'hiddenHeaderContent': true,
            'title': '基本设置',
            'key': 'base'
          },
          {
            'hiddenHeaderContent': true,
            'title': '安全设置',
            'key': 'security'
          },
          {
            'hiddenHeaderContent': true,
            'title': '个性化设置',
            'key': 'custom'
          },
          {
            'hiddenHeaderContent': true,
            'title': '账户绑定',
            'key': 'binding'
          },
          {
            'hiddenHeaderContent': true,
            'title': '新消息通知',
            'key': 'notification'
          }
        ]
      }
    ]
  },
  {
    'title': '其他',
    'key': 'others',
    'component': 'RouteView',
    'icon': 'interaction',
    'children': [
      {
        'title': '捐赠记录',
        'key': 'donateList'
      },
      {
        'title': '米菲孕婴',
        'key': 'mifei'
      },
      {
        'title': '赣南脐橙',
        'key': 'gnqc'
      }
    ]
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
