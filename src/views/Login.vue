<template>
  <div class="login">
    <div class="container">
        <img src="../assets/logovue.png" class="avatar">
      <el-form
        :model="LoginForm"
        :rules="rules"
        ref="Login-Form"
        class="demo-ruleForm"
      >
        <el-form-item prop="username">
          <el-input v-model="LoginForm.username" prefix-icon="myicon myicon-user" placeholder="请输入用户名"></el-input>
        </el-form-item>
         <el-form-item prop="password">
          <el-input type="password" v-model="LoginForm.password" prefix-icon="myicon myicon-key" placeholder="请输入密码"  @keyup.13.native="LoginSbumit('Login-Form')" show-password></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="login-btn"  @click="LoginSbumit('Login-Form')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
// 引入login API
import { login } from '../api/index'
export default {
  data () {
    return {
      LoginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    LoginSbumit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // login返回的是一个promise对象
          login(this.LoginForm).then((res) => {
            // 将token值存储到本地
            localStorage.setItem('shoppro_token', res.data.token)
            if (res.meta.status === 200) {
              // console.log(this.$store.state.currentUser)
              // this.$store.state.currentUser = res.data.username
              // this.$store.commit('setcurrentUser', res.data.username)
              this.$store.dispatch('setcurrentUser', res.data.username)
              // 跳转到homepage
              this.$router.push({ name: 'Home' })
            } else {
              this.$message.error(res.meta.msg)
            }
          })
        } else {
          this.$message.error('数据输入不合法')
          return false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #2f4050;
  .container {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 0px 40px 15px 40px;
    margin: 200px auto;
    background: white;
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #fff;
      box-shadow: 0 1px 5px #ccc;
      overflow: hidden;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>
