import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import router from './kvue-router'
// import store from './kstore'
import store from './store'
// import Notice from "./dialog/notice.vue";
// import create from "./utils/create.js";

// icons
import '@/icons' // 自动加载icons/index.js
import NoticeCtor from './utils/notice'

Vue.use(NoticeCtor)
Vue.config.productionTip = false
// Vue.prototype.$notice = function (props) {
//   const notice = create(Notice, props);
//   notice.show()
//   return notice
// }

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
