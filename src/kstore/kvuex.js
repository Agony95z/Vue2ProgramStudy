// 自己的vuex实现
let Vue

class Store {
  constructor(options) {
    // 1. 保存选项
    this.$options = options
    this._mutations = options.mutations
    this._actions = options.actions
    // 2. 暴露state属性,并对传入state选项做响应式处理
    // Vue.util.defineReactive(this, 'state', this.$options.state) // 不希望用户直接操作state
    // _vm  -- 希望用户明白，不要访问它
    this._vm = new Vue({
      data() {
        return {
          // $$ 避免vue对该属性做代理 -- this._vm.xxx这样是不行的
          $$state: options.state
        }
      } 
    })
    // 3. 绑定上下文，确保是store实例
    this.commit = this.commit.bind(this)
    this.dispatch = this.commit.bind(this)
  }
  get state() {
    return this._vm._data.$$state
  }
  set state(v) {
    console.log('please use replaceState to reset state')
  }
  // commit(type, payload)
  commit(type, payload) {
    const entry = this._mutations[type]
    if (!entry) {
      console.error('unknow mutation')
      return
    }
    entry(this.state, payload) // add(state, val)
  }
  dispatch(type, payload) {
    const entry = this._actions[type]
    if (!entry) {
      console.error('unknow actions')
      return
    }
    entry(this, payload)
  }
}

function install(_Vue) {
  Vue = _Vue
  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store
      }
    },
  })
}


export default {Store, install}