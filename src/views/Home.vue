<template>
    <el-container class="container">
      <el-header class="header">
        <el-row>
          <el-col :span="4"><img src="static/logo.png" alt=""></el-col>
          <el-col :span="16"><h2 class="middle">电商后台管理</h2></el-col>
          <el-col :span="4"><a class="logout" href="#" @click.prevent="handleLogout">退出</a></el-col>
        </el-row>
      </el-header>

      <el-container class="container">
        <el-aside class="aside" width="200px">
            <el-menu
            :router="true"
            :unique-opened="true"
            class="menu">
              <el-submenu
                v-for="item in menus"
                :key="item.id"
                :index="item.id + ''">
                  <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>{{ item.authName }}</span>
                  </template>
                  <el-menu-item
                    v-for="item1 in item.children"
                    :key="item1.id"
                    :index="'/' + item1.path">
                    <template slot="title">
                      <i class="el-icon-menu"></i>
                      <span>{{ item1.authName }}</span>
                    </template>
                  </el-menu-item>
              </el-submenu>
              <el-submenu index="4">
                  <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>订单管理</span>
                  </template>
                  <el-menu-item index="4-1">
                    <template slot="title">
                      <i class="el-icon-menu"></i>
                      订单列表
                    </template>
                  </el-menu-item>
              </el-submenu>
            </el-menu>
        </el-aside>
        <el-main class="main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
  data () {
    return {
      menus: {}
    }
  },
  // beforeCreate() {
  //   const token = sessionStorage.getItem('token')
  //   if (!token) {
  //     this.$router.push({name: 'login'})
  //     this.$message.warning('请登录')
  //   }
  // },
  created () {
    this.loadData()
  },
  methods: {
    handleLogout () {
      sessionStorage.clear()
      this.$router.push('/login')
      this.$message.success('退出成功')
    },
    async loadData () {
      const {data: resData} = await this.$http.get('menus')
      this.menus = resData.data
    }
  }
}
</script>

<style>
.container {
    height: 100%;
}
.header {
    background-color: #b3c0d1;
    /* padding: 0; */
}
.header .middle {
    margin: 0;
    line-height: 60px;
    color: #fff;
    text-align: center;
}
.header .logout {
  line-height: 60px;
  text-decoration: none;
  color: orange;
  text-align: center;
}
.header .aside {
    background-color: #d3dce6;
}
.main {
    background-color: #e9eef3;
    height: 100%;
}
</style>
