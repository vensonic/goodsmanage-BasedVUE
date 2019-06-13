import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// 保存数据
const state = {
  currentUser: ''
}
const mutations = {
  setcurrentUser (state, value) {
    state.currentUser = value
  }
}
const actions = {
  setcurrentUser ({ commit }, value) {
    commit('setcurrentUser', value)
  }
}
const getters = {
  getcurrentUser (state) {
    return state.currentUser
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
