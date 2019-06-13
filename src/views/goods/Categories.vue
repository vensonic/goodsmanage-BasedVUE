<template>
  <div class="categories">
    <!-- 分页器 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加分类按钮 -->
    <el-button type="success" plain style="margin-bottom:15px" @click="showAddCate">添加分类</el-button>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加商品分类" :visible.sync="AddCateFormVisible">
      <el-form :model="AddCateform" :label-width="'120px'">
        <el-form-item label="分类名称">
          <el-input v-model="AddCateform.cat_name" auto-complete="off" style="width:210px"></el-input>
        </el-form-item>
        <el-form-item label="选择分类">
          <el-cascader :options="cateOptions" v-model="selectedOptions" @change="handleChange" :props="props"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="AddCateFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="subAddCate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getCategories } from '@/api/goodsCate'
export default {
  data () {
    return {
      AddCateFormVisible: false,
      AddCateform: {
        cat_name: '',
        cat_pid: '',
        cat_level: ''
      },
      cateOptions: [],
      selectedOptions: [],
      props: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      }
    }
  },
  methods: {
    // 获取所有分类
    async  showAddCate () {
      this.AddCateFormVisible = true
      var res = await getCategories({ type: 2 })
      console.log(res)
      this.cateOptions = res.data.data
    },
    handleChange (value) {
      console.log(value)
    },
    // 提交添加分类
    subAddCate () {
      console.log(this.selectedOptions)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
