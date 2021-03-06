// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll  from 'vue-infinite-scroll'
import {currency} from './util/currency'

Vue.config.productionTip = false

Vue.use(infiniteScroll );

Vue.filter("currency",currency);

/* eslint-disable no-new */
Vue.use(VueLazyLoad,{
  loading: "/static/loading-svg/loading-bars.svg"
})
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});

