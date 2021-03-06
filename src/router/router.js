/**
 *  hideInMenu: true 在侧边栏中不显示
 *  name: AdminLayout 后台管理工作台
 */

/*********************** 后台页面 ************************ */
import Home from '@pages/Home/Home.js'
import setUser from '@pages/user/setUser.js'
import AdminList from '@pages/user/admin.js'
import Login from '@pages/login/login.js'
import Category from '@pages/category/category.js'
import TagComponent from '@pages/tagComponent/tagComponent.js'
import EssayEdit from '@pages/essay/essayEdit.js'
import EssayList from '@pages/essay/essayList.js'
import Comment from '@pages/comment/comment.js'
import Collect from '@pages/collect/collect.js'
import Follow from '@pages/follow/follow.js'
import Fans from '@pages/fans/fans.js'
import Project from '@pages/project/project.js'

export default [
  {
    layout: 'LoginLayout',
    path: '/login',
    name: 'login',
    title: '后台登录',
    component: Login,
  },
  {
    layout: 'LoginLayout',
    path: '/register',
    name: 'register',
    title: '注册',
    component: Login,
  },
  {
    path: '/admin',
    layout: 'AdminLayout',
    children: [
      {
        path: '/home',
        icon: 'home',
        title: '首页',
        component: Home,
      },
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
        path: '/project',
        icon: 'profile',
        title: '项目管理',
        component: Project
      },
      {
        path: '/essayList',
        icon: 'file-markdown',
        title: '文章管理',
        component: EssayList
      },
      {
        path: '/essayEdit/:id',
        title: '文章编辑',
        hideInMenu: true,
        component: EssayEdit,
      },
      {
        path: '/comment',
        icon: 'form',
        title: '评论管理',
        component: Comment,
      },
      {
        path: '/collect',
        icon: 'star',
        title: '我的收藏',
        component: Collect,
      },
      {
        path: '/follow',
        icon: 'eye',
        title: '我的关注',
        component: Follow,
      },
      {
        path: '/fans',
        icon: 'usergroup-add',
        title: '我的粉丝',
        component: Fans,
      },
      {
        path: '/user',
        icon: 'user',
        title: '用户列表',
        component: AdminList,
      },
      {
        path: '/setting',
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