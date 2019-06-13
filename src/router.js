import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Welcom from '@/views/Welcom.vue'
import UserList from '@/views/users/UserList.vue'
import Rights from '@/views/right/rights.vue'
import Roles from '@/views/right/roles.vue'
import Categories from '@/views/goods/Categories.vue'
import Goods from '@/views/goods/goods.vue'
import goodsList from '@/views/goods/goodsList.vue'
import addgoods from '@/views/goods/addgoods.vue'
Vue.use(VueRouter)
export default new VueRouter({
  routes: [
    { name: 'Login', path: '/login', component: Login },
    // 首页重定向
    { path: '/', name: 'Default', redirect: { name: 'Home' } },
    {
      name: 'Home',
      path: '/home',
      meta: '首页',
      component: Home,
      // 重定向到welcome
      redirect: { name: 'Welcom' },
      children: [
        { path: 'welcom', name: 'Welcom', component: Welcom, meta: '欢迎' },
        {
          path: 'users',
          name: 'UserList',
          component: UserList,
          meta: '用户列表'
        },
        { path: 'roles', name: 'Roles', component: Roles, meta: '角色列表' },
        { path: 'rights', name: 'Rights', component: Rights, meta: '权限列表' },
        {
          path: 'categories',
          name: 'Categories',
          component: Categories,
          meta: '商品分类列表'
        },
        {
          path: 'goods',
          name: 'Goods',
          component: Goods,
          redirect: { name: 'goodslist' },
          children: [
            { path: 'goodslist', name: 'goodslist', component: goodsList },
            { path: 'addgoods', name: 'addgoods', component: addgoods }
          ]
        }
      ]
    }
  ]
})
