<template>
  <div class="rolise">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="addbtn" style="margin:15px 0">
      <el-button type="success" plain @click="showAdd">添加角色</el-button>
    </div>
    <!-- 角色列表 -->
    <el-table :data="rolelist" border style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="first in scope.row.children" :key="first.id">
            <el-col :span="4">
              <div class="grid-content bg-purple">
                <el-tag
                  closable
                  :type="'success'"
                  @close="delRight(scope.row,first.id)"
                >{{first.authName}}</el-tag>
                <i class="el-icon-arrow-right" style="margin-left:5px"></i>
              </div>
            </el-col>
            <el-col :span="20">
              <div class="grid-content bg-purple-light">
                <el-row v-for="second in first.children" :key="second.id">
                  <el-col :span="6">
                    <div class="grid-content bg-purple">
                      <el-tag
                        closable
                        :type="'warning'"
                        @close="delRight(scope.row,second.id)"
                      >{{second.authName}}</el-tag>
                      <i class="el-icon-arrow-right" style="margin-left:5px"></i>
                    </div>
                  </el-col>
                  <el-col :span="18">
                    <div class="grid-content bg-purple">
                      <el-tag
                        v-for="third in second.children"
                        :key="third.id"
                        closable
                        :type="'info'"
                        style="margin-bottom:15px;margin-right:5px"
                        @close="delRight(scope.row,third.id)"
                      >{{third.authName}}</el-tag>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length === 0">
            <el-col :span="24">
              <div class="grid-content">该角色还没有分配任何的权限</div>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
      <el-table-column prop="roleDesc" label="描述" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain title="编辑" @click="editRole(scope.row)"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            title="删除"
            @click="delRole(scope.row.id)"
          ></el-button>
          <el-button
            type="warning"
            icon="el-icon-check"
            plain
            title="分配权限"
            @click="authorForm(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRoleFormVisible">
      <el-form :model="roleForm" :label-width="'120px'" ref="addRoleForm" :rules="rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input size="mini" v-model="roleForm.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input size="mini" v-model="roleForm.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitaddRoleForm('addRoleForm')">提交</el-button>
          <el-button @click="resetaddRoleForm('addRoleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
        <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editRoleFormVisible">
      <el-form :model="editForm" :label-width="'120px'" ref="editForm" :rules="rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input size="mini" v-model="editForm.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input size="mini" v-model="editForm.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitEditRoleForm('editForm')">提交</el-button>
          <el-button @click="resetEditRoleForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 角色授权对话框 -->
    <el-dialog title="角色授权" :visible.sync="authorFormVisible">
      <div style="height:300px;overflow:auto">
        <el-tree
          ref="tree"
          :data="rigthList"
          show-checkbox
          node-key="id"
          :default-expand-all="true"
          :default-checked-keys="selectedrightArr"
          :props="defaultProps"
        ></el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="authorFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAuthor">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getRightList } from '@/api/rights'
import {
  getRolelist,
  delRoleRightByRid,
  setRolesRight,
  addRole,
  delRoleById,
  editRoleById
} from '@/api/role'
export default {
  data () {
    return {
      editRoleFormVisible: false,
      addRoleFormVisible: false,
      editForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      roleForm: {
        roleName: '',
        roleDesc: ''
      },
      rolelist: [],
      // 是否显示授权对话框
      authorFormVisible: false,
      // 树形结构数据
      rigthList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认拥有的权限id数组
      selectedrightArr: [],
      // 当前角色id
      currentRoleId: '',
      // 表单校验规则
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 渲染列表
    render () {
      getRolelist().then(res => {
        this.rolelist = res.data
      })
    },
    // 显示添加角色对话框
    showAdd () {
      this.addRoleFormVisible = true
    },
    // 提交添加角色
    submitaddRoleForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addRole(this.roleForm).then(res => {
            if (res.data.meta.status === 201) {
              this.$message({
                type: 'success',
                message: res.data.meta.msg
              })
              this.render()
              this.addRoleFormVisible = false
            } else {
              this.$message.error(res.data.meta.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    // 重置提交角色表单
    resetaddRoleForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 显示编辑对话框
    editRole (row) {
      this.editRoleFormVisible = true
      this.editForm.id = row.id
      this.editForm.roleName = row.roleName
      this.editForm.roleDesc = row.roleDesc
    },
    // 提交编辑角色
    submitEditRoleForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          editRoleById(this.editForm).then(res => {
            if (res.data.meta.status === 200) {
              this.$message({
                type: 'success',
                message: '角色编辑成功'
              })
              this.render()
              this.editRoleFormVisible = false
              this.$refs[formName].resetFields()
            } else {
              this.$message.error(res.data.meta.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    // 重置提交角色表单
    resetEditRoleForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 删除角色
    delRole (id) {
      this.$confirm('此操作将永久删除id为' + id + '的角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delRoleById(id).then(res => {
            if (res.data.meta.status === 200) {
              this.$message({
                type: 'success',
                message: res.data.meta.msg
              })
              this.render()
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
    // 删除权限
    async delRight (row, rightId) {
      var res = await delRoleRightByRid(row.id, rightId)
      //   console.log(res)
      if (res.data.meta.status === 200) {
        this.$message({
          message: res.data.meta.msg,
          type: 'success'
        })
        // 局部刷新
        row.children = res.data.data
      } else {
        this.$message.error(res.data.meta.msg)
      }
    },
    // 角色授权
    authorForm (row) {
      // console.log(row)
      // 显示授权对话框
      this.authorFormVisible = true
      // 获取树形权限列表--一定要在每次打开这个授权对话框重新获取数据，否则数据不会被刷新
      this.getAllRightsList('tree')
      // 设置当前的roleId
      this.currentRoleId = row.id
      // 遍历前清空数组
      this.selectedrightArr.length = 0
      // 遍历该角色的所有,找出该角色下的三级权限的id,将id push到selectedrightArr数组中
      row.children.forEach((first, index) => {
        if (first.children && first.children.length !== 0) {
          first.children.forEach(second => {
            if (second.children && second.children.length !== 0) {
              second.children.forEach(third => {
                this.selectedrightArr.push(third.id)
              })
            }
          })
        }
      })
      // console.log(this.selectedrightArr)
    },
    // 提交授权
    async submitAuthor () {
      // 通过node-key获取被选中的节点的授权id---只有id没有pid
      // console.log(this.$refs.tree.getCheckedKeys())
      // console.log(this.$refs.tree.getCheckedNodes())
      var orginArr = this.$refs.tree.getCheckedNodes().map(item => {
        return item.id + ',' + item.pid
      })
      var temparr = orginArr.join(',').split(',')
      // 数组去重
      var finalArr = [...new Set(temparr)]
      var rids = finalArr.join(',')
      // console.log(this.currentRoleId, rids)
      var res = await setRolesRight(this.currentRoleId, rids)
      if (res.data.meta.status === 200) {
        this.$message({
          message: res.data.meta.msg,
          type: 'success'
        })
        this.authorFormVisible = false
        // 重新加载
        this.render()
      }
    },
    // 获取所有授权
    async getAllRightsList (type) {
      var res = await getRightList(type)
      this.rigthList = res.data.data
    }
  },
  mounted () {
    this.render()
  }
}
</script>
<style lang="less" scoped>
</style>
