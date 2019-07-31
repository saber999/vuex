import Vue from 'vue'
import Vuex from './vuex.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules:{
    a:{
      state:{
        x:1
      },
      mutations: {
        syncAdd(state,playload){
          console.log('test')
        },
      },
      modules:{
        c:{
          state:{
            bb:5
          }
        }
      }
    },
    b:{
      state:{
        y:1
      }
    }
  },
  state: {
    age:19
  },
  getters:{
    getAge(state){
      return state.age + 10
    }
  },
  mutations: {
    syncAdd(state,playload){
      return state.age+=playload
    },
    min(state,playload){
      return state.age-=playload
    }
  },
  actions: {
    asyncMin({commit,dispatch},playload){
      setTimeout(()=>{
        commit('min',playload)
      },3000)
    }
  }
})
