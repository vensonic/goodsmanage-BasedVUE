import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Welcom from '@/views/Welcom.vue'
import UserList from '@/views/users/UserList.vue'
Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    { name: 'Login', path: '/login', component: Login },
    // 首页重定向
    { path: '/', name: 'Default', redirect: { name: 'Home' } },
    {
      name: 'Home',
      path: '/home',
      component: Home,
      // 重定向到welcome
      redirect: { name: 'Welcom' },
      children: [
        { path: 'welcom', name: 'Welcom', component: Welcom },
        { path: 'userlist', name: 'UserList', component: UserList }
      ]
    }
  ]
})
