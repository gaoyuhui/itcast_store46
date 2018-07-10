import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/views/Login'
import Home from '@/views/Home'

import Users from '@/views/users/users.vue'
import Rights from '@/views/roies/Rights.vue'

Vue.use(Router)

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
        },
        {
          name: 'rights',
          path: '/rights',
          component: Rights
        }
      ]
    }
  ]
})
