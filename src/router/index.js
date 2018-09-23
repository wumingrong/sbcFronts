import Vue from 'vue'
import Router from 'vue-router'
import test from '@/components/test'
import Login from '@/components/Login'
import Home from '@/components/Home'
import PermissionView from '@/components/auth/Permission'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '登录',
      component: Login,
      hidden: true
    },
    {
      path: '/login',
      name: '登录',
      component: Login,
      hidden: true
    }, {
      path: '/home',
      name: 'Home',
      component: Home,
      hidden: true
    }, {
      path: '/test',
      name: 'test',
      component: test
    }, {
      path: '/auth/permission/view',
      name: 'permission',
      component: PermissionView
    }
  ]
})
