
// 1. 实现响应式
function defineReactive(obj, key, val) {
  // 1.1 如果val本身还是对象，需要递归处理
  observe(val)
  // 四: 创建一个Dep实例和key对应
  const dep = new Dep()
  Object.defineProperty(obj, key, {
    get() {
      console.log('get', key, '被触发')
      // 依赖收集
      Dep.target && dep.addDep(Dep.target)
      return val
    },
    set(v) {
      if (v !== val) {
        console.log('set', key, '被触发')
        val = v
        // 1.3 如果传入的v是一个对象，仍要做响应式处理
        observe(v)
        dep.notify()
      }
    }
  })
}

// 2. 循环obj中的所有key
function observe(obj) {
  // 1.2 判断obj的值，必须是object
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  Object.keys(obj).forEach(key => defineReactive(obj, key, obj[key]))
}

// 3. 实现vue.set
function set(obj, key, val) {
  defineReactive(obj, key, val)
}

function proxy(vm) {
  Object.keys(vm.$data).forEach(key => {
    Object.defineProperty(vm, key, {
      get() {
        return vm.$data[key]
      },
      set(v) {
        vm.$data[key] = v
      }
    })
  })
}

// 一: 声明KVue实例
class KVue {
  constructor(options) {
    // 1. 保存选项
    this.$options = options
    this.$data = options.data
    // 2. 对data选项做响应式处理
    observe(options.data)
    // 2.5 代理 -- 让用户可以直接访问属性，不需要通过this.data.xx
    proxy(this)
    // 3. 编译
    // new Compile(options.el, this)
    if (options.el) {
      this.$mount(options.el)
    }
  }
  // 修改为带有vdom的
  // 添加$mount
  $mount(el) {
    this.$el = document.querySelector(el)
    // 1. 声明updateComponent
    const updateComponent = () => {
      /* // 渲染获取视图结构
      const el = this.$options.render.call(this)
      // 结果追加
      const parent = this.$el.parentElement // 获取body
      parent.insertBefore(el, this.$el.nextSibling)
      parent.removeChild(this.$el) //更新替换 oldDom
      this.$el = el */

      // vnode 方案
      const vnode = this.$options.render.call(this, this.$createElement) // 拿到vdom
      this._update(vnode)
    }
    // 2. new Watcher 管理当前的更新函数
    // this -- Kvue实例 updateComponent -- 对应组件
    new Watcher(this, updateComponent)
  }
  // 接收vdom 转换为dom
  _update(vnode) {
    const preVnode = this._vnode
    if (!preVnode) {
      // init
      this.__patch__(this.$el, vnode)
    } else {
      // update: diff 
      this.__patch__(preVnode, vnode)
    }
    // 这一次新的就是下一次老的
    this._vnode = vnode
  }
  __patch__(oldVnode, vnode) {
    if (oldVnode.nodeType) {
      // 真实节点 init
      const parent = oldVnode.parentElement
      const refElm = oldVnode.nextSibling // 参考节点
      // 递归创建dom结构
      const el = this.createElm(vnode)
      parent.insertBefore(el, refElm)
      parent.removeChild(oldVnode)
    } else {
      // update
      // 操作谁 vnode.el获取的是真实dom
      const el = vnode.el = oldVnode.el // 新节点是下一次的老节点
      // diff
      if (oldVnode.tag === vnode.tag) {
        // sameVnode
        // todo: props... 
        // children 
        const oldCh = oldVnode.children
        const newCh = vnode.children
        if (typeof newCh === 'string') {
          if (typeof oldCh === 'string') {
            // text update
            if (newCh !== oldCh) {
              el.textContent = newCh
            }
          } else {
            // replcae element with text
            el.textContent = newCh
          }
        } else { // newCh is array
          if (typeof oldCh !== 'string') {
            // update children
            this.updateChildren(el, oldCh, newCh)
          } else { // newCh is string
            // replcae text with element 
            el.textContent = newCh
            // ...
          }
        }
      } else { // not sameNode
        // replace
      }
    }
  }
  updateChildren(el, oldCh, newCh) {
    // diff 算法
  }
  // 递归创建dom树
  createElm(vnode) {
    const el = document.createElement(vnode.tag)
      // todo: props
      // children
      if (vnode.children) {
        if (typeof vnode.children === 'string') {
          // text
          el.textContent = vnode.children
        } else {
          // array children
          vnode.children.forEach(item => {
            const child = this.createElm(item)
            el.appendChild(child)
          })
        }
      }
       // 保存真实dom用于更新
    vnode.el = el
    return el
  }
  // 返回vdom
  $createElement(tag, props, children) {
    return {tag, props, children}
  }
}
// 二: 声明Compile
class Compile {
  constructor(el, vm) {
    // 3.1 保存Kvue实例
    this.$vm = vm
    // 3.2 编译模板树
    this.compile(document.querySelector(el))
  }
  // el是模板中的根结点
  compile(el) {
    // 3.2.1 遍历el 获取el所有子节点
    el.childNodes.forEach(node => {
      // 3.2.2 判断node类型 
      if (node.nodeType === 1) {
        // 元素
        // console.log('element', node.nodeName)
        this.compileElement(node)
        // 递归⭐
        if (node.childNodes.length > 0) {
          this.compile(node)
        }
      } else if (this.isInter(node)) {
        // 插值文本
        // console.log('text', node.textContent)
        this.compileText(node)
      } 
    })
  }
  // 判断是否为插值表达式 {{xx}}
  isInter(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }
  // 编译element
  compileElement(node) {
    // 1. 获取当前元素的所有属性，并判断他们是不是动态的
    const nodeAttrs = node.attributes
    Array.from(nodeAttrs).forEach(attr => {
      console.log(attr)
      const attrName = attr.name
      const exp = attr.value
      // 判断attrName是否是指令或者事件等动态的模板引擎语法
      if (attrName.startsWith('k-')) {
        // 指令
        // 截取k-后面的内容,特殊处理
        const dir = attrName.substring(2)
        // 判断是否存在指令处理函数,若存在则调用它
        this[dir] && this[dir](node, exp)
      }

    })
  }

  // 统一做初始化和更新处理
  commonUpdate(node, exp, dir) {
    // 初始化
    const fn = this[dir + 'Updater']
    fn && fn(node, this.$vm[exp])
    // 更新
    new Watcher(this.$vm, exp, function(val) {
      fn && fn(node, val)
    })
  }

  // 处理插值文本 {{xx}}
  compileText(node) {
    // RegExp.$1 === counter;RegExp.$1拿到的是{{xx}}中的xx
    // node.textContent = this.$vm[RegExp.$1]
    this.commonUpdate(node, RegExp.$1, 'text')
  }

  textUpdater(node, val) {
    node.textContent = val
  }

  // k-text
  text(node, exp) {
    // node.textContent = this.$vm[exp]
    this.commonUpdate(node, exp, 'text')
  }
  // k-html
  html(node, exp) {
    // node.innerHTML = this.$vm[exp]
    this.commonUpdate(node, exp, 'html')
  }
  htmlUpdater(node, val) {
    node.innerHTML = val
  }
}


// 三:声明Watcher
// 负责具体更新任务的Watcher 编译的过程中new Watcher
class Watcher {
  constructor(vm, fn) {
    this.vm = vm
    this.getter = fn
    this.get()
  }
  get () {
     // 触发依赖收集⭐
     Dep.target = this
    // 下行代码---fn.call(this.vm)
     this.getter.call(this.vm) // 传入的组件更新函数激活依赖收集
     Dep.target = null
  }
  // 将来Dep通知更新的时候,执行fn--updateComponent
  update() {
    this.get()
  }
}


// 四:声明Dep
// 和data中的响应式key之间是一一对应的关系
class Dep {
  constructor() {
    // 保存关联的watcher实例
    this.deps = new Set()
  }
  addDep(watcher) {
    this.deps.add(watcher)
  }
  notify() {
    this.deps.forEach(watcherItem => watcherItem.update())
  }
}