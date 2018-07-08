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
              <el-submenu index="1">
                  <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>用户管理</span>
                  </template>
                  <el-menu-item index="/users">
                    <template slot="title">
                      <i class="el-icon-menu"></i>
                      用户管理
                    </template>
                  </el-menu-item>
              </el-submenu>

              <el-submenu index="2">
                  <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>权限管理</span>
                  </template>
                  <el-menu-item index="/roles">
                    <template slot="title">
                      <i class="el-icon-menu"></i>
                      角色列表
                    </template>
                  </el-menu-item>
                  <el-menu-item index="/rights">
                    <template slot="title">
                      <i class="el-icon-menu"></i>
                      权限列表
                    </template>
                  </el-menu-item>
              </el-submenu>

              <el-submenu index="3">
                  <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>商品管理</span>
                  </template>
                  <el-menu-item index="3-1">
                    <template slot="title">
                      <i class="el-icon-menu"></i>
                      商品列表
                    </template>
                  </el-menu-item>
                  <el-menu-item index="3-2">
                    <template slot="title">
                      <i class="el-icon-menu"></i>
                      分类参数
                    </template>
                  </el-menu-item>
                  <el-menu-item index="3-3">
                    <template slot="title">
                      <i class="el-icon-menu"></i>
                      商品分类
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

              <el-submenu index="5">
                  <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>数据统计</span>
                  </template>
                  <el-menu-item index="5-1">
                    <template slot="title">
                      <i class="el-icon-menu"></i>
                      数据报表
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
  beforeCreate() {
    const token = sessionStorage.getItem('token')
    if (!token) {
      this.$routet.push({name: 'login'})
      this.$message.warning('请登录')
    }
  },
  methods: {
    handleLogout () {
      sessionStorage.clear()
      this.$router.push('/login')
      this.$message.success('退出成功')
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
