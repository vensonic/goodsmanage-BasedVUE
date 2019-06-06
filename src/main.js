import Vue from 'vue'
import App from './App.vue'
// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 引入路由
import router from '@/router'
// 引入样式
require('@/styles/index.less')
// 添加路由导航守卫,判断是否登录过
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('shoppro_token')
  if (token) {
    next()
  } else {
    if (to.path !== '/login') {
      // 如果是非登录路劲且没有登录过,则跳转到登录页面
      next({ path: '/login' })
    } else {
      next()
    }
  }
})
Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
