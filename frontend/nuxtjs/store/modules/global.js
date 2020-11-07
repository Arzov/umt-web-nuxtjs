const getLocalStorageState = key => (localStorage.getItem(key))

const getDefaultState = () => ({
  themePreference: getLocalStorageState('themePreference')
    ? getLocalStorageState('themePreference') : 'dark'
})

const state = getDefaultState

const getters = {
  getGlobal (state) {
    return state
  }
}

const actions = {
  setTheme (ctx, data) {
    const params = {
      themePreference: 'dark'
    }

    if (ctx.getters.getGlobal.themePreference === 'light') {
      ctx.commit('setState', { params })
    } else {
      params.themePreference = 'light'
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
