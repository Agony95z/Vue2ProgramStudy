import Vue from 'vue'
import Vuex from './kvuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    add(state, val) {
      state.count = val
      state.count++
    }
  },
  actions: {
    add({commit, dispatch, state}) {
      setTimeout(() => {
        commit('add')
      }, 1000)
    }
  },
  modules: {
  }
})
