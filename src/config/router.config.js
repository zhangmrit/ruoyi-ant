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
    'title': 'menu.form',
    'key': 'form',
    'component': 'RouteView',
    'redirect': '/form/baseForm',
    'icon': 'form',
    'children': [
      {
        'title': 'menu.form.basic',
        'key': 'baseForm',
        'icon': ''
      },
      {
        'title': 'menu.form.step',
        'key': 'stepForm',
        'icon': ''
      },
      {
        'title': 'menu.form.advanced',
        'key': 'advancedForm',
        'icon': ''
      },
      {
        'title': 'menu.form.edit',
        'key': 'editorForm',
        'icon': ''
      }
    ]
  },
  {
    'title': 'menu.list',
    'key': 'list',
    'component': 'RouteView',
    'redirect': '/list/tableList',
    'icon': 'table',
    'children': [{
      'title': 'menu.list.table',
      'key': 'tableList',
      'icon': ''
    },
    {
      'title': 'menu.list.standard',
      'key': 'standardList',
      'icon': ''
    },
    {
      'title': 'menu.list.card',
      'key': 'cardList',
      'icon': ''
    },
    {
      'title': 'menu.list.search',
      'redirect': '/list/search/article',
      'key': 'search',
      'children': [
        {
          'title': 'menu.list.search.article',
          'key': 'article'
        },
        {
          'title': 'menu.list.search.project',
          'key': 'project'
        },
        {
          'title': 'menu.list.search.application',
          'key': 'application'
        }
      ]
    }
    ]
  },
  {
    'title': 'menu.profile',
    'key': 'profile',
    'component': 'RouteView',
    'redirect': '/profile/profileBasic',
    'icon': 'profile',
    'children': [{
      'title': 'menu.profile.basic',
      'key': 'profileBasic',
      'icon': ''
    },
    {
      'title': 'menu.profile.advanced',
      'key': 'profileAdvanced',
      'icon': ''
    }
    ]
  },
  {
    'title': 'menu.result',
    'key': 'result',
    'component': 'RouteView',
    'icon': 'check-circle-o',
    'children': [{
      'hiddenHeaderContent': true,
      'title': 'menu.result.succ',
      'key': 'resultSucc',
      'icon': ''
    },
    {
      'hiddenHeaderContent': true,
      'title': 'menu.result.err',
      'key': 'resultErr',
      'icon': ''
    }
    ]
  },
  {
    'title': 'menu.exception',
    'key': 'exception',
    'component': 'RouteView',
    'icon': 'warning',
    'children': [
      {
        'hiddenHeaderContent': true,
        'title': 'menu.exception.403',
        'key': 'error403'
      },
      {
        'hiddenHeaderContent': true,
        'title': 'menu.exception.404',
        'key': 'error404'
      },
      {
        'hiddenHeaderContent': true,
        'title': 'menu.exception.500',
        'key': 'error500'
      }
    ]
  },
  {
    'title': 'menu.account',
    'key': 'account',
    'component': 'RouteView',
    'icon': 'user',
    'children': [
      {
        'hiddenHeaderContent': true,
        'title': 'menu.account.center',
        'key': 'center'
      },
      {
        'title': 'menu.account.settings',
        'key': 'settings',
        'hideChildrenInMenu': true,
        'redirect': '/account/settings/base',
        'children': [
          {
            'hiddenHeaderContent': true,
            'title': 'menu.account.settings.base',
            'key': 'base'
          },
          {
            'hiddenHeaderContent': true,
            'title': 'menu.account.settings.security',
            'key': 'security'
          },
          {
            'hiddenHeaderContent': true,
            'title': 'menu.account.settings.custom',
            'key': 'custom'
          },
          {
            'hiddenHeaderContent': true,
            'title': 'menu.account.settings.binding',
            'key': 'binding'
          },
          {
            'hiddenHeaderContent': true,
            'title': 'menu.account.settings.notification',
            'key': 'notification'
          }
        ]
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
