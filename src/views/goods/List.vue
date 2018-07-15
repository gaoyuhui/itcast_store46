<template>
    <el-card class="box-card">
      <my-breadcrumb level1="商品管理" level2="商品列表"></my-breadcrumb>
      <el-row class="searchArea">
        <el-col :span="24">
          <el-input class="searchInput" clearable placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          <el-button type="success" @click="$router.push({name: 'goods-add'})">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table
        stripe
        border
        :data="list"
        style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column
            prop="goods_name"
            label="商品名称">
        </el-table-column>
        <el-table-column
            prop="goods_price"
            label="商品价格（元）">
        </el-table-column>
        <el-table-column
            prop="goods_weight"
            label="商品重量">
        </el-table-column>
        <el-table-column
            prop="goods_number"
            label="创建时间">
        </el-table-column>
        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <el-button plain size="mini" type="primary" icon="el-icon-edit" ></el-button>
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
export default {
  data () {
    return {
      list: [],
      pagenum: 1,
      pagesize: 5,
      total: 0
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    async loadData () {
      const res = await this.$http.get(`goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      this.list = res.data.data.goods
      this.total = res.data.data.total
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.loadData()
    },
    handleCurrentChange(val) {
      this.pagenum = val
      this.loadData()
    }
  }
}
</script>

<style>
.searchInput {
    width: 300px;
    margin-top: 15px;
    margin-bottom: 15px;
}
</style>
