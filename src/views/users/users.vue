<template>
    <el-card class="box-card">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-row class="searchArea">
            <el-col :span="24">
                <el-input class="searchInput" clearable placeholder="请输入内容">
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
                <el-button type="success">添加用户</el-button>
            </el-col>
        </el-row>

         <el-table
         v-loading="loading"
         stripe
         border
         :data="list"
         style="width: 100%">
          <el-table-column
            type="index">
          </el-table-column>
            <el-table-column
              prop="username"
              label="姓名"
              width="100">
            </el-table-column>
            <el-table-column
              prop="email"
              label="邮箱"
              width="180">
            </el-table-column>
            <el-table-column
              prop="mobile"
              label="电话">
            </el-table-column>
             <el-table-column
              label="创建日期">
              <template slot-scope="scope">
                {{ scope.row.create_time | fmtData('YYYY-MM-DD') }}
              </template>
            </el-table-column>

            <el-table-column
              label="用户状态"
              width="100">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.mg_state"
                  active-color="#13ce66"
                  inactive-color="#ff4949">
                </el-switch>
              </template>
            </el-table-column>

             <el-table-column
              label="操作">
              <template slot-scope="scope">
                  <el-button plain size="mini" type="primary" icon="el-icon-edit" ></el-button>
                  <el-button plain size="mini" type="success" icon="el-icon-check" ></el-button>
                  <el-button plain size="mini" type="info" icon="el-icon-message" c></el-button>
              </template>
            </el-table-column>
         </el-table>
    </el-card>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      loading: true
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.loading = true
      const token = sessionStorage.getItem('token')
      this.$http.defaults.headers.common['Authorization'] = token
      const res = await this.$http.get('users?pagenum=1&pagesize=10')
      this.loading = false
      const data = res.data
      const {meta: {msg, status}} = data
      if (status === 200) {
        const {data: {users}} = data
        this.list = users
      } else {
        this.$message.error(msg)
      }
    }
  }
}
</script>

<style>
.box-card {
    width: 100%;
    height: 100%;
}
.searchArea {
    margin-top: 10px;
    margin-bottom: 10px;
}
.searchInput {
    width: 350px;
}
</style>
