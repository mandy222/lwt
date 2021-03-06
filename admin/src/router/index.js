import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
  path: '/login',
  component: () => import('@/views/login/index'),
  hidden: true
},

{
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  children: [{
    path: 'dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index'),
    meta: {
      title: '首页',
      icon: 'dashboard'
    }
  }]
},

{
  path: '/404',
  component: () => import('@/views/404'),
  hidden: true
}]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [{
  path: '/system',
  component: Layout,
  redirect: '/system/auth',
  name: 'System',
  meta: {
    title: '系统管理',
    icon: 'component',
    roles: ['system']
  },
  children: [{
    path: 'role',
    component: () => import('@/views/system/role/index'),
    meta: {
      title: '角色管理',
      icon: 'peoples',
      roles: ['system_role']
    }
  }, {
    path: 'auth',
    component: () => import('@/views/system/auth/index'),
    meta: {
      title: '权限管理',
      icon: 'password',
      roles: ['system_authority']
    }
  }]
},
{
  path: '/user',
  component: Layout,
  children: [{
    path: 'index',
    name: 'User',
    component: () => import('@/views/user/index'),
    meta: {
      title: '用户管理',
      icon: 'user',
      roles: ['user']
    }
  }]
},
{
  path: '/category',
  component: Layout,
  children: [{
    path: 'index',
    name: 'Category',
    component: () => import('@/views/category/index'),
    meta: {
      title: '分类管理',
      icon: 'list',
      roles: ['category']
    }
  }]
},
{
  path: '/news',
  component: Layout,
  children: [{
    path: 'index',
    name: 'News',
    component: () => import('@/views/news/index'),
    meta: {
      title: '资讯管理',
      icon: 'documentation',
      roles: ['news']
    }
  }, {
    hidden: true,
    path: 'edit',
    name: 'NewsEdit',
    component: () => import('@/views/news/newsEdit'),
    meta: {
      title: '资讯管理'
    }
  }]
},
{
  path: '/activity',
  component: Layout,
  children: [{
    path: 'index',
    name: 'Activity',
    component: () => import('@/views/activity/index'),
    meta: {
      title: '活动管理',
      icon: 'activity',
      roles: ['activity']
    }
  }, {
    hidden: true,
    path: 'edit',
    name: 'ActivityEdit',
    component: () => import('@/views/activity/activityEdit'),
    meta: {
      title: '活动管理'
    }
  }]
},
{
  path: '/trends',
  component: Layout,
  children: [{
    path: 'index',
    name: 'Trends',
    component: () => import('@/views/trends/index'),
    meta: {
      title: '动态管理',
      icon: 'trends',
      roles: ['trends']
    }
  }, {
    hidden: true,
    path: 'edit',
    name: 'TrendsEdit',
    component: () => import('@/views/trends/trendsEdit'),
    meta: {
      title: '动态管理'
    }
  }]
},
{
  path: '/ad',
  component: Layout,
  children: [{
    path: 'index',
    name: 'Ad',
    component: () => import('@/views/ad/index'),
    meta: {
      title: '广告位管理',
      icon: 'ad',
      roles: ['ad']
    }
  }, {
    hidden: true,
    path: 'edit',
    name: 'adEdit',
    component: () => import('@/views/ad/adEdit'),
    meta: {
      title: '动态管理'
    }
  }]
},
{
  path: '/information',
  component: Layout,
  children: [{
    path: 'index',
    name: 'Information',
    component: () => import('@/views/information/index'),
    meta: {
      title: '消息管理',
      icon: 'email',
      roles: ['information']
    }
  }]
},

// 404 page must be placed at the end !!!
{
  path: '*',
  redirect: '/404',
  hidden: true
}]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
