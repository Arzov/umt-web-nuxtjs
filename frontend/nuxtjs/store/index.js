import Vuex from 'vuex'
import user from './modules/user'
import start from './modules/start'

const store = () => {
  return new Vuex.Store({
    modules: {
      user,
      start
    }
  })
}

export default store
