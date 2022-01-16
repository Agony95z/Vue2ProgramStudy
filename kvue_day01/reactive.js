
// 1. 实现响应式
function defineReactive(obj, key, val) {
  // 1.1 如果val本身还是对象，需要递归处理
  observe(val)
  Object.defineProperty(obj, key, {
    get() {
      console.log('get', key, '被触发')
      return val
    },
    set(v) {
      if (v !== val) {
        console.log('set', key, '被触发')
        val = v
        // 1.3 如果传入的v是一个对象，仍要做响应式处理
        observe(v)
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

const obj = {
  foo: 'foo',
  bar: 'bar',
  baz: {
    a: 1
  }
}
// 对obj做响应式处理
// defineReactive(obj, 'foo', 'foooo')
observe(obj)