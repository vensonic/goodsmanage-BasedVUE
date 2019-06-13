<template>
  <div class="users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <div style="margin-top: 15px">
      <el-input
        placeholder="请输入内容"
        v-model="querySelect.query"
        class="input-with-select"
        style="width:300px;margin-right :15px"
        @keyup.enter.native="render"
        clearable
      >
        <el-button slot="append" icon="el-icon-search" @click="render"></el-button>
      </el-input>
      <el-button type="success" plain @click="addDialogFormVisible = true">添加用户</el-button>
    </div>
    <!-- 用户信息列表 -->
    <el-table :data="users" border style="width: 100%;margin-top: 15px">
      <el-table-column type="index" width="50"  align="center"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180" align="center"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"  align="center"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="180"  align="center"></el-table-column>
      <el-table-column label="状态" width="120"  align="center" >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeStatu($event,scope.row.id)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作"  align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="usersEdit(scope.row)"
            icon="el-icon-edit"
            plain
            title="编辑"
          ></el-button>
          <el-button
            type="danger"
            @click="userDelete(scope.row.id)"
            icon="el-icon-delete"
            plain
            title="删除"
          ></el-button>
          <el-button
            type="warning"
            @click="userAuthor(scope.row)"
            icon="el-icon-check"
            plain
            title="授权管理"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querySelect.pagenum"
        :page-sizes="[4, 6, 8, 10]"
        :page-size="querySelect.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 添加用户弹出层 -->
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
      <el-form
        :model="addForm"
        status-icon
        :rules="addFormRules"
        ref="addForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password" auto-complete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="addForm.checkPass" auto-complete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitAddForm('addForm')">提交</el-button>
          <el-button @click="resetAddForm('addForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 编辑弹出层 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" :rules="editRules" ref="editForm">
        <el-form-item label="用户名:" :label-width="formLabelWidth">
          <el-input v-model="editForm.username" auto-complete="off" style="width:300px" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" :label-width="formLabelWidth" prop="email">
          <el-input v-model="editForm.email" auto-complete="off" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="editForm.mobile" auto-complete="off" style="width:300px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="subEdit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 授权弹出层 -->
    <el-dialog title="用户授权" :visible.sync="authorDialogFormVisible">
      <el-form :model="authorForm"  label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="authorForm.username" disabled style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="authorForm.rid" placeholder="请选择" @change='getSelect'>
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="authorDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getUserslist,
  addUser,
  updateUserStautsById,
  updateUserById,
  delUserStautsById
} from '../../api/index'
import { getRolelist, setRoleById } from '../../api/role'
export default {
  data () {
    // 定义密码校验函数
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.addForm.checkPass !== '') {
          this.$refs.addForm.validateField('checkPass')
        }
        callback()
      }
    }
    // 确认密码函数
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.addForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      // 查询对象
      querySelect: {
        query: '',
        pagenum: 1,
        pagesize: 4
      },
      // 总页数
      total: 0,
      // 用户数据列表
      users: [],
      // 添加用户对话框是否弹出
      addDialogFormVisible: false,
      // 添加表单数据对象
      addForm: {
        username: '',
        password: '',
        checkPass: '',
        email: '',
        mobile: ''
      },
      // 添加用户表单规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            pattern: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
            message: '邮箱输入不正确',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          {
            pattern: /^1[34578]\d{9}$/,
            message: '目前只支持中国大陆的手机号码',
            trigger: 'blur'
          }
        ]
      },
      // 编辑对话框是否弹出
      editDialogFormVisible: false,
      // 编辑对话框表单数据对象
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      // 编辑对话框的标签宽度
      formLabelWidth: '120px',
      // 编辑用户的规则
      editRules: {
        email: [{ required: true, message: '请输入邮箱地址', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入电话号码', trigger: 'blur' }]
      },
      // 是否弹出授权角色对话框
      authorDialogFormVisible: false,
      // 角色表单数据对象
      authorForm: {
        username: '',
        id: '',
        rid: ''
      },
      roleList: []
    }
  },
  methods: {
    // 渲染函数
    render () {
      getUserslist(this.querySelect).then(res => {
        this.total = res.data.total
        this.users = res.data.users
      })
    },

    // 提交新增用户
    submitAddForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addUser(this.addForm).then(res => {
            // console.log(res)
            if (res.meta.status === 201) {
              this.render()
              this.$message({
                message: res.meta.msg,
                type: 'success'
              })
              this.addDialogFormVisible = false
              // 重置表单
              this.$refs[formName].resetFields()
            } else {
              this.$message({
                message: res.meta.msg,
                type: 'error'
              })
            }
          })
        } else {
          this.$message({
            message: '输入有误',
            type: 'error'
          })
        }
      })
    },
    // 重置新增表单
    resetAddForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 修改状态
    changeStatu (type, id) {
      updateUserStautsById(type, id).then(res => {
        // console.log(res)
        this.$message({
          message: res.meta.msg,
          type: 'success'
        })
      })
    },
    // 编辑用户
    usersEdit (obj) {
      // 显示对话框
      this.editDialogFormVisible = true
      // 设置编辑对话框的默认值
      this.editForm.id = obj.id
      this.editForm.username = obj.username
      this.editForm.email = obj.email
      this.editForm.mobile = obj.mobile
    },
    // 提交编辑
    subEdit () {
      updateUserById(this.editForm).then(res => {
        // console.log(res)
        if (res.meta.status === 200) {
          this.render()
          this.$message({
            message: res.meta.msg,
            type: 'success'
          })
        } else {
          this.$message({
            message: res.meta.msg,
            type: 'error'
          })
        }
      })
      this.editDialogFormVisible = false
    },
    // 删除用户
    userDelete (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delUserStautsById(id).then(res => {
            if (res.meta.status === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.render()
            } else {
              this.$message({
                type: 'success',
                message: res.meta.msg
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 用户授权
    userAuthor (obj) {
      // console.log(obj)
      this.authorDialogFormVisible = true
      this.authorForm.id = obj.id
      this.authorForm.username = obj.username
      this.authorForm.rid = obj.rid
    },
    // 角色选择触发的事件
    getSelect (id) {
      // console.log(id)
      // this.authorForm.rid = id
    },
    // 提交角色设置
    setRole () {
      setRoleById(this.authorForm.id, this.authorForm.rid).then(res => {
        if (res.meta.status === 200) {
          this.$message({
            message: res.meta.msg,
            type: 'success'
          })
          this.authorDialogFormVisible = false
          this.render()
        } else {
          this.$message({
            message: res.meta.msg,
            type: 'error'
          })
        }
      })
    },
    // 分页方法:每页显示条数改变
    handleSizeChange (val) {
      //   console.log(`每页 ${val} 条`)
      this.querySelect.pagesize = val
      this.render()
    },
    // 分页方法:当前页数发生改变
    handleCurrentChange (val) {
      // 当前页数
      this.querySelect.pagenum = val
      this.render()
    }
  },
  mounted () {
    // 调用渲染方法
    this.render()
    // 获取所有角色
    getRolelist().then((res) => {
      // console.log(res)
      this.roleList = res.data
    })
    console.log(this.$route)
  }
}
</script>
<style lang="less" scoped>
.block {
  width: 100%;
  background: #f5f5f5;
  margin-top: 15px;
}
</style>
