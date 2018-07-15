<template>
  <el-card class="box-card">
    <my-breadcrumb level1="商品管理" level2="商品分类"></my-breadcrumb>
    <el-row class="btn">
        <el-col :span="24">
            <el-button @click="handleshowAdd">添加商品分类</el-button>
            <el-dialog title="添加商品分类" :visible.sync="dialogFormVisibleAdd">
            <el-form :model="addForm">
              <el-form-item label="分类名称" :label-width="formLabelWidth">
                <el-input v-model="addForm.cat_name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="活动区域" :label-width="formLabelWidth">
                <el-cascader
                  expand-trigger="hover"
                  :options="options"
                  :props="{
                    label: 'cat_name',
                    value: 'cat_id',
                    children: 'children'
                  }"
                  :change-on-select="true"
                  v-model="selectedOptions2">
                </el-cascader>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
              <el-button type="primary" @click="handleAdd">确 定</el-button>
            </div>
          </el-dialog>
        </el-col>
    </el-row>

    <el-table
    v-loading="loading"
    stripe
    border
    :data="list"
    style="width: 100%">
    <el-tree-grid
      prop="cat_name"
      treeKey="cat_id"
      parentKey="cat_pid"
      levelKey="cat_level"
      childKey="children"
      :indentSize="40"
      label="分类名称">
    </el-tree-grid>
    <el-table-column
        prop="cat_level"
        label="级别"
        width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-else-if="scope.row.cat_level === 1">二级</span>
          <span v-else-if="scope.row.cat_level === 2">三级</span>
        </template>
    </el-table-column>
    <el-table-column
        prop="cat_deleted"
        label="是否有效">
        <template slot-scope="scope">
          {{ scope.row.cat_deleted ? '无效': '有效' }}
        </template>
    </el-table-column>
    <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button @click="handelCompile(scope.row)" plain size="mini" type="primary" icon="el-icon-edit" ></el-button>
          <el-button @click="handelDelete(scope.row.cat_id)" plain size="mini" type="danger" icon="el-icon-delete" ></el-button>
          <!-- 编辑 -->
          <el-dialog title="编辑商品分类" :visible.sync="dialogFormVisible">
          <el-form>
            <el-form-item label="分类名称" :label-width="formLabelWidth">
              <el-input v-model="Name" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handelCompileAxios">确 定</el-button>
          </div>
      </el-dialog>
        </template>
    </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
</template>

<script>
import ElTreeGrid from 'element-tree-grid'

export default {
  data () {
    return {
      list: [],
      pagesize: 5,
      pagenum: 1,
      total: 0,
      loading: true,
      // 编辑
      Name: '',
      cat_id: -1,
      dialogFormVisible: false,
      formLabelWidth: '68px',
      // 添加
      addForm: {
        cat_name: ''
      },
      selectedOptions2: [],
      options: [],
      dialogFormVisibleAdd: false
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    async handleshowAdd () {
      this.addForm.cat_name = ''
      this.selectedOptions2 = []
      this.dialogFormVisibleAdd = true
      const res = await this.$http.get(`/categories`, {
        params: {
          type: '2'
        }
      })
      this.options = res.data.data
    },
    async handleAdd () {
      const formData = {
        ...this.addForm,
        cat_pid: this.selectedOptions2[this.selectedOptions2.length - 1],
        cat_level: this.selectedOptions2.length
      }
      const res = await this.$http({
        url: '/categories',
        method: 'post',
        data: formData
      })
      const {data: {meta: {msg, status}}} = res
      if (status === 201) {
        this.$message.success(msg)
        this.loadData()
        this.dialogFormVisibleAdd = false
      } else {
        this.$message.error(msg)
      }
    },
    async handelDelete (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete('categories/' + id)
        const data = res.data
        const {meta: {msg, status}} = data
        if (status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.loadData()
        } else {
          this.$message.error(msg)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async handelCompile (row) {
      this.Name = row.cat_name
      this.cat_id = row.cat_id
      this.dialogFormVisible = true
    },
    async handelCompileAxios () {
      const res = await this.$http.put(`categories/${this.cat_id}`, {
        cat_name: this.Name
      })
      const {data: {meta: {msg, status}}} = res
      if (status === 200) {
        this.$message.success(msg)
        this.dialogFormVisible = false
        this.loadData()
      } else {
        this.$message.error(msg)
      }
    },
    async loadData () {
      this.loading = true
      const {data: resData} = await this.$http.get(`categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      this.loading = false
      const {data: {result, total}} = resData
      this.list = result
      this.total = total
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.loadData()
    },
    handleCurrentChange(val) {
      this.pagenum = val
      this.loadData()
    }
  },
  components: {
    ElTreeGrid
  }
}
</script>

<style>
.btn {
    margin-top: 15px;
    margin-bottom: 15px;
}
.pagination {
  margin-top: 15px;
}
</style>
