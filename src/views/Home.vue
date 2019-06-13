<template>
  <div class="home">
    <el-container>
      <el-aside width="auto">
        <h1 class="logo"></h1>
        <el-menu
          default-active="2"
          class="el-menu-admin"
          :unique-opened="true"
          :router="true"
          :collapse="isCollapse"
          background-color="#409EFF"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/home/'+sub.path" v-for="sub in item.children " :key="sub.id">
              <i class="el-icon-user"></i>
              <span>{{sub.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <span class="toggle-btn myicon myicon-menu" @click="isCollapse = !isCollapse"></span>
          <h2 class="system-title">电商后台管理系统</h2>
          <div class="welcome">
              <span>你好:{{$store.getters.getcurrentUser}}</span>
              <a href="javascript:;" @click="loginout">退出</a>
          </div>
        </el-header>
        <el-main>
            <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { getMenus } from '@/api/rights'
export default {
  data () {
    return {
      menuList: [],
      isCollapse: false
    }
  },
  methods: {
    loginout () {
      localStorage.clear()
      this.$router.push({ name: 'Login' })
    }
  },
  mounted () {
    getMenus().then((res) => {
      this.menuList = res.data.data
    })
  }
}
</script>
<style lang="less" scoped>
.home {
  height: 100%;
   .el-menu-admin:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #409EFF;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color:  #409EFF;
  }
  .logo {
    height: 60px;
    background: url(../assets/logo.png);
    background-size: cover;
    background-color: #fff;
    width: auto
  }
  .toggle-btn {
    padding: 0 15px;
    margin-left: -20px;
    font-size: 36px;
    color: white;
    cursor: pointer;
    line-height: 60px;
    &:hover {
      background-color: #4292cf;
    }
  }
  .system-title {
    font-size: 28px;
    color: white;
  }
  .welcome {
    color: #000;
  }
}
</style>
