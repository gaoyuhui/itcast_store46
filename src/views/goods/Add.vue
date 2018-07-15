<template>
    <el-card class="box-card">
        <my-breadcrumb level1="商品管理" level2="商品列表"></my-breadcrumb>
        <template>
          <el-button class="btn">添加商品信息</el-button>
        </template>
        <el-steps :active="stepActive" finish-status="success" align-center class="finish">
          <el-step title="基本信息"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
        </el-steps>
        <el-tabs tab-position="left" v-model="activeName" @tab-click="handleTabclick">
          <el-tab-pane label="基本信息" name="0" >
            <el-form label-position="top" ref="form" label-width="80px" :model="form">
              <el-form-item label="商品名称">
                <el-input v-model="form.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格">
                <el-input v-model="form.goods_price"></el-input>
              </el-form-item>
              <el-form-item label="商品重量">
                <el-input v-model="form.goods_weight"></el-input>
              </el-form-item>
              <el-form-item label="商品数量">
                <el-input v-model="form.goods_number"></el-input>
              </el-form-item>
              <el-form-item label="商品分类">
                <CategoryCascader
                  type="3"
                  @gaibianle="handleGaiBianLe">
                </CategoryCascader>
              </el-form-item>
              <el-button @click="handle">下一步</el-button>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="1">
            <el-upload
              action="http://localhost:8888/api/private/v1/upload"
              :headers="headers"
              :on-success="handleUploadSuccess"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList2"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
            <el-row>
                <el-col :span="4">
                  <el-button @click="handle">下一步</el-button>
                </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="2">
              <quill-editor v-model="form.goods_introduce"
              ref="myQuillEditor"
              class="text"
              @blur="onEditorBlur($event)"
              @focus="onEditorFocus($event)"
              @ready="onEditorReady($event)">
              </quill-editor>
            <el-row>
              <el-col :span="24">
                <el-button type="primary" @click="handleAdd">立即创建</el-button>
                <el-button>取消</el-button>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
    </el-card>
</template>

<script>
import CategoryCascader from '@/components/CategoryCascader.vue'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  data () {
    return {
      fileList2: [],
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      },
      activeName: '0',
      stepActive: 0,
      form: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: '',
        cat_introduce: '',
        pics: []
      }
    }
  },
  methods: {
    handleUploadSuccess (response, file, fileList) {
      this.form.pics.push({
        pic: response.data.tmp_path
      })
    },
    handleRemove(file, fileList) {
      const index = this.form.pics.findIndex(function (item) {
        return item.pic === file.response.data.tmp_path
      })
      if (index !== -1) {
        this.form.pics.splice(index, 1)
      }
    },
    handlePreview(file) {
      console.log(file)
    },
    onEditorBlur () {
      console.log('onEditorBlur')
    },
    onEditorFocus () {
      console.log('onEditorFocus')
    },
    onEditorReady () {
      console.log('onEditorReady')
    },
    handleTabclick (tab, event) {
      this.stepActive = tab.index - 0
    },
    handle () {
      this.activeName = Number.parseInt(this.activeName) + 1 + ''
      this.stepActive++
    },
    async handleAdd () {
      const res = await this.$http.post('goods', this.form)
      const data = res.data
      const {meta: {msg, status}} = data
      if (status === 201) {
        this.$message.success(msg)
        this.$router.push({name: 'goods-list'})
      } else {
        this.$message.error(msg)
      }
      console.log(res)
    },
    handleGaiBianLe (data) {
      this.form.goods_cat = data.join(',')
    }
  },
  components: {
    quillEditor,
    CategoryCascader
  }
}
</script>

<style>
.finish {
    margin-top: 15px;
    margin-bottom: 15px;
}
.btn {
  text-align: center;
  width: 100%;
  height: 40px;
  background-color: #ccc;
  border: 1px solid #ccc;
  margin-top: 15px;
}
.text {
  height: 350px;
}

</style>
