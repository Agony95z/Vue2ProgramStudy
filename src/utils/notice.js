import Notice from "../dialog/notice.vue";
import create from "./create.js";
class NoticeCtor {
  constructor() {}
}
NoticeCtor.install = function (Vue) {
  // Vue.mixin({
  //   beforeCreate() {
  //     Vue.prototype.$notice = function (props) {
  //       const notice = create(Notice, props);
  //       notice.show()
  //       return notice
  //     }
  //   },
  // })
  Vue.prototype.$notice = function (props) {
    const notice = create(Notice, props);
    notice.show()
    return notice
  }
}
export default NoticeCtor