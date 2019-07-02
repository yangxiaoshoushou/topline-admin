/**
* vue 容器
*/
// 1. npm i vuex
// 2.配置
import Vue from 'vue'
import Vuex from 'vuex'
import { Object } from 'core-js'

Vue.use(Vuex)

// 3.创建容器对象
const store = new Vuex.Store({
  state: {
    user: JSON.parse(window.localStorage.getItem('user_info'))
  },
  mutations: {
    changeUser (state, data) {
      // 拷贝 将data拷贝到state.user中
      // assign方法：将第二个参数传给第一个参数
      Object.assign(state.user, data)
      // 将修改后的用户信息保存到本地
      window.localStorage.setItem('user_info', JSON.stringify(state.user))
    }
  }
})

// 4.导出容器对象
export default store
