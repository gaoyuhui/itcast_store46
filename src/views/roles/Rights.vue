<template>
  <el-card class="box-card">
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
     <el-table
      class="tb"
      border
      stripe
      :data="list"
      style="width: 100%">
      <el-table-column type="index" width="50px"></el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
        width="180">
      </el-table-column>
      <el-table-column
        prop="level"
        label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-else-if="scope.row.level === '1'">二级</span>
          <span v-else-if="scope.row.level === '2'">三级</span>
          <span v-else-if="scope.row.level === '3'">四级</span>
        </template>
      </el-table-column>
    </el-table>

  </el-card>
</template>

<script>
export default {
  data () {
    return {
      list: []
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    async loadData () {
      const res = await this.$http.get('rights/list')
      const data = res.data
      this.list = data.data
    }
  }
}
</script>

<style>
.tb {
  height: 100%;
  margin-top: 15px;
  overflow: auto;
}
</style>
