<template>
  <div class="goodslist">
    <el-input
      placeholder="请输入内容"
      prefix-icon="el-icon-search"
      v-model="goodsForm.query"
      clearable
      style="width:220px"
    ></el-input>
    <el-button type="success" plain style="margin-left:15px" @click="$router.push({name:'addgoods'})">添加商品</el-button>
    <el-table :data="goodsList" border style="width: 100%; margin-top:15px">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="300"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)" width='120'></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width='120'></el-table-column>
      <el-table-column label="添加时间"  width='160'>
         <template slot-scope="scope">
            <span>{{scope.row.add_time|dateFormate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini">编辑</el-button>
          <el-button size="mini" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getAllgoods } from '@/api/goods.js'
export default {
  data () {
    return {
      goodsForm: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodsList: []
    }
  },
  mounted () {
    getAllgoods(this.goodsForm).then(res => {
      // console.log(res)
      this.goodsList = res.data.data.goods
    })
  },
  filters: {
    // 格式化日期
    dateFormate (time) {
      var date = new Date(time)
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var day = date.getDate()
      var hour = date.getHours()
      var min = date.getMinutes()
      var second = date.getSeconds()
      void (month < 10 ? '0' + month : month)
      void (day < 10 ? '0' + day : day)
      void (hour < 10 ? '0' + hour : hour)
      void (min < 10 ? '0' + min : min)
      void (second < 10 ? '0' + second : second)
      return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + second
    }
  }
}
</script>
<style lang="less" scoped>
</style>
