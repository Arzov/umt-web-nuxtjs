const getLocalStorageState = key => (localStorage.getItem(key))

const getDefaultState = () => ({
  themePreference: getLocalStorageState('themePreference')
    ? getLocalStorageState('themePreference') : 'light'
})

const state = getDefaultState

const getters = {
  getGlobals (state) {
    return state
  }
}

const actions = {
  setTheme (ctx, data) {
    const params = {
      themePreference: 'light'
    }

    if (ctx.getters.getGlobals.themePreference === 'light') {
      params.themePreference = 'dark'
      ctx.commit('setState', { params })
    } else {
      ctx.commit('setState', { params })
    }
  },
  resetStates (ctx) {
    ctx.commit('resetStates')
  }
}

const mutations = {
  setState (state, { params }) {
    for (const key in params) {
      localStorage.setItem(key, params[key])
      state[key] = params[key]
    }
  },
  resetStates (state) {
    Object.assign(state, getDefaultState())
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
