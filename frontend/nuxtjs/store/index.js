import Vuex from 'vuex'
import global from './modules/global'
import user from './modules/user'
import start from './modules/start'
import register from './modules/register'

const store = () => {
  return new Vuex.Store({
    modules: {
      global,
      user,
      start,
      register
    }
  })
}

export default store
