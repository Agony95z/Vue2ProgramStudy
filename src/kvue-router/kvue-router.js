/* 
自己实现的router
  ### 实现一个插件
- 实现VueRouter类
  - 处理路由选项
  - 监控url变化，hashchange
  - 响应这个变化
- 实现install方法
  - $router注册
  - 两个全局组件

*/
// 2. 声明Vue变量
// 通过install(Vue)方法的调用将Vue构造函数传递进来而不是用import引入，将来打包的时候就可以降低耦合性
let Vue;

// 1.声明插件VueRouter

class VueRouter {
  constructor(options) {
    // 1.1 保存路由选项
    this.$options = options // 1.1.1 通过this.$options可以访问到用户配置表
    // 1.3 给current一个初始值
    // this.current = window.location.hash.slice(1) || '/'
    // 1.4 使current成为一个响应式数据
    Vue.util.defineReactive(this, 'current', window.location.hash.slice(1) || '/') // defineReactive可以给一个对象指定一个响应式属性
    // 1.2 监控hash的变化
    window.addEventListener('hashchange', () => {
      this.current = window.location.hash.slice(1) //截取锚点后的值 eg: #/about -- /about
      console.log(this.current)
    })
  }
}

// 参数1 Vue的构造函数
VueRouter.install = function (_Vue) {
  // 传入构造函数，可以对其进行扩展
  Vue = _Vue
  // 3. 注册$router，让所有组件实例都可以访问它
  /* 
    3-1: 考虑方案1： Vue.prototype.$router = router 
    存在的问题：因为在./index.js去调用Vue.use(VueRouter)的时候会执行install方法，install方法的执行早于 
    const router = new VueRouter({
      routes
    }) 构造函数
    也早于main.js里
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
    存在的问题是 在执行install的时候，拿不到router实例
    解决：延迟执行，延迟到router实例和Vue实例都创建完毕--混入--自己写插件的时候
    当你想访问Vue实例的时候，组件实例的时候，都需要混入，因为只有混入的时候，才可以通过this获取到组件实例
  */
 Vue.mixin({
  // 延迟执行，延迟到router实例和Vue实例都创建完毕
  // 因为beforeCreate的执行时间是组件实例化的时候，在创建组件实例之前执行
  beforeCreate () {
    // this -- 组件实例
    if (this.$options.router) {
      // 如果存在说明是根实例
      Vue.prototype.$router = this.$options.router // 在所有的组件上挂载$router
    }
  }
 })
  // 4，注册两个全局组件：router-link,router-view
  Vue.component('router-link', {
    // 4.2
    props: {
      // 声明一个to属性
      to: {
        type: String,
        required: true
      }
    },
    // template: '<a>2123</a>' //  // 方案1：Pass, 没有编译器的vue版本无法解析字符串
    // 方案2
    // 4.1
    // h函数--是render函数调用时，框架传入的createElement,返回虚拟dom
    render(h) {
      return h('a', { 
        attrs: {
          // <router-link to="/about">About</router-link> 想要解析成<a href="#/about">About</a>
          href: '#' + this.to
        }
      }, this.$slots.default) // this.$slots.default --匿名插槽内容 eg:<router-link to="/">Home</router-link> 取到Home文本
    }
  })
  // 4.3 动态渲染我们想要的内容
  Vue.component('router-view', {
    // current成为响应式后，二者产生依赖关系，current值更新触发render函数
    render(h) {
      let component = null
      // 如果h函数接收的是一个组件配置对象，则会直接渲染组件
      // 4.3.1 获取当前url的hash部分 -- this.current 在router实例上挂载，该如何拿到current?  install执行优先于new VueRouter({...})
      // 当前this是router-view的组件实例,在beforeCreate钩子里，为所有组件都挂载了$router
      // this.$router.current
      // 4.3.2 根据hash部分从路由表中获取对应的组件
      /* 
        const router = new VueRouter({
          routes
        })
      */
     console.log(this.$router.$options.routes, this.$router.current)
      const route = this.$router.$options.routes.find(route => route.path === this.$router.current) // 拿到路由实例的配置表routes
      console.log(route)
      if (route) {
        component = route.component // 拿匹配到的组件
      }
      return h(component)
    }
  })
}
// 5. 导出VueRouter
export default VueRouter