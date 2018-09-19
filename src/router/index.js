import Vue from 'vue'
import Router from 'vue-router'
import NotFound from '@/pages/404.vue'
import Layout from '@/pages/Layout'
import Home from '@/pages/Home'
import Help from '@/pages/Help'
import Analyze from '@/pages/Analyze'
import Table3 from '@/pages/Table3'
import Job from '@/pages/Job'
const _import = require('./_import_' + process.env.NODE_ENV);

Vue.use(Router);

export default new Router({
  // linkActiveClass: 'active',
  // linkExactActiveClass: 'active',
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Layout,
      children: [
        { // 二级路由。对应Layout.vue
          path: '/',
          name: '大数据分析',
          component: _import('Home'),
          meta: {
            menu: true,
            keepAlive: true // 需要被缓存
          }
        },
        { // 二级路由。对应Layout.vue
          path: 'analyze',
          name: '单站分析',
          component: _import('Analyze'),
          meta: {
            menu: true,
            keepAlive: true // 需要被缓存
          }
        },
        { // 二级路由。对应Layout.vue
          path: 'help',
          name: 'help',
          component: _import('Help'),
          meta: {
            // menu: true,
          //   keepAlive: true // 需要被缓存
          }
        },
        { // 二级路由。对应Layout.vue
          path: 'Table3',
          name: '历史数据查询',
          component: _import('Table3'),
          meta: {
            menu: true,
            keepAlive: true // 需要被缓存
          }
        },
        { // 二级路由。对应Layout.vue
          path: 'job',
          name: '任务管理',
          component: _import('Job'),
          meta: {
            menu: true,
            // keepAlive: true // 需要被缓存
          }
        }
      ]
    },
    {
      path: '/404',
      component: NotFound,
      name: '',
      hidden: true
    },
    {
      path: '*',
      hidden: true,
      redirect: { path: '/404' }
    }
  ]
})
