import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  NProgress.start()

  document.title = getPageTitle(to.meta.title)

  // 判断是否登录 从cookie中取得token
  const hasToken = getToken()

  // 已登录
  if (hasToken) {
    if (to.path === '/login') {
      // 前往的路径是'/login'  则返回 '/'
      next({ path: '/' })
      NProgress.done()
    } else {
      // 判断权限 从store中取得用户的 roles, 也就是用户的权限 并且用户的权限数组必须有一个以上
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        // 有权限，直接进入
        next()
      } else {
        // 没有权限
        try {
          // 获取用户信息
          const { roles } = await store.dispatch('user/getInfo')

          // 获取可访问路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // 将可访问路由添加到路由上
          router.addRoutes(accessRoutes)

          // 进入路由
          // replace: true 导航就不会留下历史记录
          next({ ...to, replace: true })
        } catch (error) {
          // 如果出现异常，清空路由
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    // 未登录
    // 判断是否是白名单
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      // 其他跳到/login
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
