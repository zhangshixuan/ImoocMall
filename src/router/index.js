import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from './../views/GoodsList'
import Cart from '@/views/Cart'
import Address from '@/views/Address'




Vue.use(Router)

export default new Router({
  // mode:'history',
  routes: [
    {
      path: '/',
      component: GoodsList
    },
    {
      path: '/cart',
      component: Cart
    },
    {
      path: '/address',
      component: Address
    }
  ]
})
