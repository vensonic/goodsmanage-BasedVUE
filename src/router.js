import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    { name: 'Login', path: '/login', component: Login },
    // 首页重定向
    { path: '/', name: 'Default', redirect: { name: 'Login' } },
    { name: 'Home', path: '/home', component: Home }
  ]
})
