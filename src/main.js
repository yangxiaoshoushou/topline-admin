import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import JSONbig from 'json-bigint'
import store from './store'

import router from './router'
import './styles/index.less'

import 'nprogress/nprogress.css'

// axios.defaults.baseURL = 'http://toutiao.course.itcast.cn/mp/v1_0/'
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
axios.defaults.transformResponse = [function (data) {
  // return JSONbig.parse(data)
  try {
    return JSONbig.parse(data)
  } catch (err) {
    return data
  }
}]
// 请求拦截器
axios.interceptors.request.use(config => {
  const userInfo = JSON.parse(window.localStorage.getItem('user_info'))
  if (userInfo) {
    config.headers.Authorization = `Bearer ${userInfo.token}`
  }
  return config
}, function (error) {
  return Promise.reject(error)
})
// 响应拦截器
axios.interceptors.response.use(response => {
  // Do something with response data
  // return JSONbig.parse(JSON.stringify(response.data.data))
  if (typeof response.data === 'object' && response.data.data) {
    return response.data.data
  } else {
    return response.data
  }
}, error => {
  const status = error.response.status
  if (status === 401) {
    window.localStorage.removeItem('user_info')
    router.push({
      name: 'login'
    })
  }
  return Promise.reject(error)
})
Vue.prototype.$http = axios
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
