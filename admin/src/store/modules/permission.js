import { asyncRoutes, constantRoutes } from '@/router'

/**
 * 通过 meta.role 判断用户是否有权限
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * F生成可访问路由
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    // 判断当前路由是否可以访问
    if (hasPermission(roles, tmp)) {
      // 如果当前路由还有子路由
      if (tmp.children) {
        // 进行递归处理
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    // 添加的路由
    state.addRoutes = routes
    // 将 vuex 中的路由进行更新
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      // 如果roles包含 'admin' 直接可以全部访问
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        // 利用 filterAsyncRoutes 过滤出可访问的路由
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      // 保存可访问的路由到store中
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
