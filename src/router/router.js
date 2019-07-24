/**
 *  hideInMenu: true 在侧边栏中不显示
 *  name: BasicLayout 后台管理工作台
 */

// import Test1 from '@pages/Test/Test1.js'
// import Test2 from '@pages/Test/Test2.js'
// import Test3 from '@pages/Test/Test3.js'
// import Home from '@pages/Home/Home.js'
import User from '@pages/User/User.js'
import Login from '@pages/Login/Login.js'
import Category from '@pages/Category/Category.js'
import TagComponent from '@pages/TagComponent/TagComponent.js'

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
        component: User,
      }
    ]
  },
  {
    path: '/400',
    name: 'error_400',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/pages/Exception/400.js')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/pages/Exception/500.js')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/pages/Exception/404.js')
  }
]