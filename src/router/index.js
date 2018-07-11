import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/views/Login'
import Home from '@/views/Home'

import Users from '@/views/users/users.vue'
import Rights from '@/views/roles/Rights.vue'
import Roles from '@/views/roles/Roles.vue'

import Category from '@/views/goods/Category.vue'
import {Message} from 'element-ui'
Vue.use(Router)

const router = new Router({
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
          name: 'roles',
          path: '/roles',
          component: Roles
        },
        {
          name: 'rights',
          path: '/rights',
          component: Rights
        },
        {
          neme: 'category',
          path: '/categories',
          component: Category
        }
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.name === 'login') {
    next()
  } else {
    const token = sessionStorage.getItem('token')
    if (!token) {
      router.push({name: 'login'})
      Message.warning('请登录')
      return
    }
    next()
  }
})

export default router
