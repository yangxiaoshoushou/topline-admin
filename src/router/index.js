import Vue from 'vue'
import Router from 'vue-router'
import nprogress from 'nprogress'

Vue.use(Router)

const router = new Router({
  routes: [
    // {
    //   name: 'home',
    //   path: '/',
    //   component: () => import('@/views/home')
    // },
    {
      // name: 'layout',
      path: '/',
      component: () => import('@/views/layout'),
      children: [
        {
          name: 'home',
          path: '',
          component: () => import('@/views/home')
        },
        {
          name: 'publish',
          path: '/publish',
          component: () => import('@/views/publish')
        },
        {
          name: 'publish-edit',
          path: '/publish/:id',
          component: () => import('@/views/publish')
        },
        {
          name: 'article-list',
          path: '/article',
          component: () => import('@/views/article')
        },
        {
          name: 'article-comment',
          path: '/comment',
          component: () => import('@/views/comment')
        }
      ]
    },
    {
      name: '',
      path: '/Login',
      component: () => import('@/views/Login')
    }
  ]
})

// router.beforeEach((to, from, next) => {
//   nprogress.start()
//   const userInfo = window.localStorage.getItem('user_info')

//   // 如果是非 /login 页面，判断其登录状态
//   if (to.path !== '/login') {
//     // 如果没有登录，让其跳转到登录页
//     if (!userInfo) {
//       next({ name: 'login' })
//     } else {
//       // 如果登录了，则允许通过
//       next()
//     }
//   } else {
//     // 如果登录了，就不允许访问登录页了
//     if (userInfo) {
//       next(false)
//     } else {
//       // 没有登录，才允许访问登录页
//       next()
//     }
//   }
// })
router.afterEach((to, from) => {
  nprogress.done()
})
export default router
