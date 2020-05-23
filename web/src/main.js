import Vue from 'vue'
import App from './App.vue'
import router from './router'

import Vant from 'vant'
import 'vant/lib/index.css'
Vue.use(Vant)

import './assets/iconfont/iconfont.css'
import './assets/scss/style.scss'
import './assets/iconfont/iconfont'
import './assets/scss/animate.css'
import './assets/scss/vue2-editor.scss'

import store from './store'


// import axios from 'axios'

import Panel from './components/Panel.vue'
Vue.component('m-panel', Panel)

import ImgCard from './components/ImgCard.vue'
Vue.component('m-imgCard', ImgCard)

Vue.config.productionTip = false
// Vue.prototype.$http = axios.create({
//   // baseURL: process.env.VUE_APP_API_URL || '/web/api'
//   baseURL: 'http://localhost:3000/web/api'
// })

import http from './http'
Vue.prototype.$http = http

Vue.mixin({
  computed: {
    uploadUrl() {
      return this.$http.defaults.baseURL + '/upload'
    }
  },
  methods: {
    // getAuthHeaders() {
    //   return {
    //     Authorization: `Bearer ${localStorage.token || ''}`
    //   }
    // }
  }
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')