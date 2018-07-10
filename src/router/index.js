import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/views/Login'
import Home from '@/views/Home'

import Users from '@/views/users/users.vue'

Vue.use(Router)

// const token = sessionStorage.getItem('token')
// this.$http.defaults.headers.common['Authorization'] = token
export default new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      redirect: '/users',
      children: [
        {
          name: 'users',
          path: '/users',
          component: Users
        }
      ]
    }
  ]
})
