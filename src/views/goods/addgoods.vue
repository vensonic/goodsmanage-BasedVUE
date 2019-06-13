<template>
  <div class="addgoods">
    <!-- 步骤条 -->
    <el-steps :active="active-0" finish-status="success">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
    </el-steps>
    <el-form style="margin-top:30px" label-width="80px" :model="addgoodsForm">
      <el-tabs v-model="active" @tab-click="handleClick" tab-position="left" style="height:360px">
        <el-tab-pane label="添加商品信息" name="0">
          <el-form-item label="商品名称:">
            <el-input v-model="addgoodsForm.goods_name" size="mini" style="width:280px"></el-input>
          </el-form-item>
          <el-form-item label="商品价格:">
            <el-input v-model="addgoodsForm.goods_price" size="mini" style="width:280px"></el-input>
          </el-form-item>
          <div id="goodcount">
            <el-form-item label="数量:">
              <el-input
                v-model="addgoodsForm.goods_number"
                size="mini"
                style="width:80px;padding:0px"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="重量(kg):">
              <el-input
                v-model="addgoodsForm.goods_weight"
                size="mini"
                style="width:80px;padding:0px"
                type="number"
              ></el-input>
            </el-form-item>
          </div>
          <el-form-item label="商品分类:">
            <el-cascader
              :options="cateList"
              v-model="selectedOptions"
              @change="handleChange"
              :props="cateProps"
            ></el-cascader>
          </el-form-item>
          <el-button-group style="margin:50px 0 0 300px">
            <el-button type="primary" round @click="next">下一步</el-button>
          </el-button-group>
        </el-tab-pane>
        <el-tab-pane label="上传商品图片" name="1">
          <div class="upload" style="height:260px;width:300px">
            <el-upload
              class="upload-demo"
              action="http://localhost:8888/api/private/v1/upload"
              list-type="picture"
              :on-success="uploadsuccess"
              :headers="uploadHeaders"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </div>
          <el-button-group style="margin-left:200px">
            <el-button type="primary" round @click="pre" plain>上一步</el-button>
            <el-button type="primary" round @click="next">下一步</el-button>
          </el-button-group>
        </el-tab-pane>
        <el-tab-pane label="添加商品描述" name="2">
          <div class="goodDesc">
            <quill-editor
              v-model="addgoodsForm.goods_introduce"
              ref="myQuillEditor"
              :options="editorOption"
              @change="onEditorChange"
            ></quill-editor>
            <div style="margin-top:15px;margin-left:400px">
              <el-button type="primary" round @click="pre" plain>上一步</el-button>
              <el-button type="primary" round @click="submitGoodInfo">提交商品信息</el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>
<script>
import { getCategories } from '@/api/goodsCate'
import { addGoods } from '@/api/goods'
export default {
  data () {
    return {
      addgoodsForm: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      active: 0,
      cateList: [],
      selectedOptions: [],
      cateProps: {
        checkStrictly: true,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 设置上传图片请求头
      uploadHeaders: {
        Authorization: localStorage.getItem('shoppro_token')
      },
      editorOption: {}
    }
  },
  methods: {
    handleClick () {},
    // 当选择框改变时触发的函数
    handleChange () {
      this.addgoodsForm.goods_cat = this.selectedOptions.join(',')
    },
    // 上一步
    pre () {
      this.active = (this.active - 0 - 1).toString()
    },
    // 下一步
    next () {
      this.active = (this.active - 0 + 1).toString()
    },
    // 图片上传成功
    uploadsuccess (res) {
      this.addgoodsForm.pics.push({ pic: res.data.tmp_path })
    },
    onEditorChange ({ html }) {
      this.addgoodsForm.goods_introduce = html
    },
    // 提交商品
    async submitGoodInfo () {
      // console.log(this.addgoodsForm)
      let res = await addGoods(this.addgoodsForm)
      if (res.data.meta.status === 201) {
        this.$message({
          type: 'success',
          message: res.data.meta.msg
        })
        this.$router.push({ name: 'goodslist' })
      } else {
        this.$message.error(res.data.meta.msg)
      }
    }
  },
  mounted () {
    getCategories({ type: 3 }).then(res => {
      this.cateList = res.data.data
    })
  }
}
</script>
<style lang="less">
.addgoods .el-form-item {
  margin-bottom: 0px;
}
#goodcount input.el-input__inner {
  padding: 0px;
}
.quill-editor {
  height: 280px;
  width: 620px;
  .ql-container {
    height: 180px;
  }
}
</style>
