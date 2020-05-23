import Vue from 'vue'
import { getToken, setToken, removeToken } from '@/utils/auth'

// const http = Vue.prototype.$http

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    id: '',
    fans: [],
    follower: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    sessionStorage.setItem('name', name)
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    sessionStorage.setItem('avatar', avatar)
    state.avatar = avatar
  },
  SET_ID: (state, id) => {
    sessionStorage.setItem('id', id)
    state.id = id
  },
  SET_FANS: (state, fans) => {
    sessionStorage.setItem('fans', fans)
    state.fans = fans
  },
  SET_FOLLOWER: (state, follower) => {
    sessionStorage.setItem('follower', follower)
    state.follower = follower
  }
}

const actions = {
  // user login
  register({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      Vue.prototype.$http.post('/rest/users/create', userInfo).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  login({
    commit
  }, userInfo) {
    return new Promise((resolve, reject) => {
      Vue.prototype.$http.post('/user/login', userInfo).then(response => {
        const {
          data
        } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      Vue.prototype.$http.get(`/user/info`).then(response => {
        console.log('response', response)
        const { data } = response
        const { _id, username, avatar, fans, follower } = data.list
        console.log('_id', _id)
        commit('SET_ID', _id)
        commit('SET_NAME', username)
        commit('SET_AVATAR', avatar)
        commit('SET_FANS', fans)
        commit('SET_FOLLOWER', follower)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      Vue.prototype.$http.post(`/logout`).then(() => {
        removeToken()
        commit('RESET_STATE')
        sessionStorage.clear()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

