/**
 *  hideInMenu: true 在侧边栏中不显示
 *  name: BasicLayout 后台管理工作台
 */

// import Test1 from '@pages/Test/Test1.js'
// import Test2 from '@pages/Test/Test2.js'
// import Test3 from '@pages/Test/Test3.js'
// import Home from '@pages/Home/Home.js'
import setUser from '@pages/user/setUser.js'
import Login from '@pages/login/login.js'
import Category from '@pages/category/category.js'
import TagComponent from '@pages/tagComponent/tagComponent.js'

export default [
  {
    layout: 'LoginLayout',
    path: '/login',
    name: 'login',
    title: '后台登录',
    component: Login,
  },
  {
    path: '/admin',
    layout: 'BasicLayout',
    children: [
      // {
      //   path: '/home',
      //   icon: 'home',
      //   title: '首页',
      //   component: Home,
      //   children: [
      //     {
      //       path: '/test2',
      //       title: '测试2',
      //       component: Test2,
      //     },
      //     {
      //       path: '/test1',
      //       title: '测试1',
      //       component: Test1,
      //       children: [
      //         {
      //           path: '/test3',
      //           title: '测试3',
      //           component: Test3,
      //         }
      //       ]
      //     }
      //   ]
      // },
      {
        path: '/category',
        icon: 'global',
        title: '类型管理',
        component: Category,
      },
      {
        path: '/tag',
        icon: 'tags',
        title: '标签管理',
        component: TagComponent,
      },
      {
        path: '/user',
        icon: 'setting',
        title: '个人设置',
        component: setUser,
      }
    ]
  },
  {
    path: '/400',
    name: 'error_400',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/pages/exception/400.js')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/pages/exception/500.js')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/pages/exception/404.js')
  }
]