import Vue from 'vue'
/*global Vue*/
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import test from '@/components/test'
import about from '@/components/about'
import button from '@/components/button'

Vue.use(Router)

module.exports = new Router({
  mode: 'history',
  routes: [
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld
    // },
    {
      path: '/test',
      name: 'test',
      component: test
    },
    {
      path: '/about',
      name: 'about',
      component: about
    },
    {
      path: '/',
      name: 'button',
      component: button
    },
  ]
})
