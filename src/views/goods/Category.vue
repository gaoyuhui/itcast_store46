<template>
  <el-card class="box-card">
    <my-breadcrumb level1="商品管理" level2="商品分类"></my-breadcrumb>
    <el-row class="btn">
        <el-col :span="24">
            <el-button>添加分类</el-button>
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
    <!-- <el-table-column
        prop="cat_name"
        label="分类名称"
        width="180">
    </el-table-column> -->
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
          {{ scope.row.cat_deleted ? '有效': '无效' }}
        </template>
    </el-table-column>
    <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" icon="el-icon-edit" ></el-button>
          <el-button plain size="mini" type="success" icon="el-icon-check" ></el-button>
          <el-button plain size="mini" type="danger" icon="el-icon-delete" ></el-button>
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
      loading: true
    }
  },
  created () {
    this.loadData()
  },
  methods: {
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
