import Vue from "vue"
// 将组件配置对象转换为组件构造函数
export default function create(Component, props) {
  // 1. 转换为组件构造函数
  // 1.1 Vue.extend(Comp)
  const Ctor = Vue.extend(Component)
  const comp = new Ctor({
    propsData: props
  })
  // 2.手动挂载到body上
  comp.$mount() // 只挂载 vdom => dom
  // 挂载之后$el就填充了
  // 手动追加至body
  document.body.appendChild(comp.$el)
  // 释放资源
  comp.remove = function() {
    document.body.removeChild(comp.$el)
    comp.$destroy()
  }
  return comp
  // 1.2 new Vue({render: h => h(Comp)}) // 实现2
}