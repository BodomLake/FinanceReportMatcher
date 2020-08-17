import Vue from 'vue'
import Vuex from 'vuex'

import {createPersistedState, createSharedMutations} from 'vuex-electron'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  plugins: [
    createPersistedState(),
    createSharedMutations()
  ],
  strict: process.env.NODE_ENV !== 'production',
  state: {
    count: 0
  },
  mutations: {
    add: ((state, payload) => {
      state.count += 1;
      console.log('state的属性', state);
      return (state.count);
    })
  },
  actions: {
    actionA({commit, dispatch}) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          commit('add')
          resolve()
        }, 1000)
      })
    },
    actionB({dispatch, commit}) {
      setTimeout(() => {
        console.log('actionB启动')
        return dispatch('actionA').then(() => {
          commit('add')
        })
      }, 3000)

    }
  },
  getters: {},
  devtools: true
})
