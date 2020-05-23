import axios from 'axios'
// import Vue from 'vue'
import router from './router'
import { Toast } from 'vant';
import { getToken } from './utils/auth'

const http = axios.create({
  // baseURL: process.env.VUE_APP_API_URL || '/web/api',
  baseURL: 'http://localhost:3000/web/api'
})
http.interceptors.request.use(function (config) {
  // Do something before request is sent
  const token = getToken()
  if (token) {
    config.headers.Authorization = 'Bearer ' + token
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});
http.interceptors.response.use(res => {
  return res
}, err => {
  if (err.response.data.message) {
    Toast.fail(err.response.data.message)
    if (err.response.status === 401) {
      router.push('/register')
    }
  }
  
  return Promise.reject(err)
})

export default http