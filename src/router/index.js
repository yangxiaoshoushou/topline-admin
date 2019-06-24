import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'home',
      path: '/',
      component: () => import('@/views/home')
    },
    {
      name: 'layout',
      path: '/layout',
      component: () => import('@/views/layout')
    },
    {
      name: 'Login',
      path: '/Login',
      component: () => import('@/views/Login')
    }
  ]
})
