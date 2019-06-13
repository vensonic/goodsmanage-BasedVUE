<template>
  <div class="rights">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 权限列表 -->
    <el-table :data="rightList" stripe border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="authName" label="权限" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column label="层级" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.level | levelformat}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getRightList } from '../../api/rights'
export default {
  data () {
    return {
      rightList: []
    }
  },
  methods: {
    async getRightListByType (type) {
      var res = await getRightList(type)
      this.rightList = res.data.data
    }
  },
  mounted () {
    this.getRightListByType('list')
  },
  filters: {
    levelformat (lid) {
      switch (lid) {
        case '0':
          return '一级'
        case '1':
          return '二级'
        case '2':
          return '三级'
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
