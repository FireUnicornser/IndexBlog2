import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import BlogLoad from './modules/BlogLoad'
import BlogData from './modules/BlogData'
import BlogUser from './modules/BlogUser'

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    BlogLoad,
    BlogData,
    BlogUser
  }
})
