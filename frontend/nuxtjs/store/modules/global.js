import errorNotification from '@/static/data/errorNotification.json'

const getLocalStorageState = key => (JSON.parse(localStorage.getItem(key)))

const getDefaultState = () => ({
  themePreference: getLocalStorageState('themePreference') || 'dark',
  allowGeoloc: getLocalStorageState('allowGeoloc') || false
})

const state = getDefaultState

const getters = {
  get (state) {
    return state
  }
}

const actions = {
  setTheme (ctx, data) {
    const params = {
      themePreference: 'dark'
    }

    if (ctx.getters.get.themePreference === 'light') {
      ctx.commit('setState', { params })
    } else {
      params.themePreference = 'light'
      ctx.commit('setState', { params })
    }
  },
  setGeoloc (ctx, data) {
    const params = {
      allowGeoloc: data.allowGeoloc
    }
    ctx.commit('setState', { params })
  },
  resetStates (ctx) {
    ctx.commit('resetStates')
  },
  signOut (ctx, data) {
    ctx.commit('resetStates')
    ctx.commit('user/resetStates', {}, { root: true })

    return new Promise((resolve, reject) => {
      this.$AWS.Auth.signOut()
        .then(() => {
          resolve()
        })
        .catch((err) => {
          const response = { ...errorNotification, err }
          reject(response)
        })
    })
  }
}

const mutations = {
  setState (state, { params }) {
    for (const key in params) {
      if (['themePreference', 'allowGeoloc'].includes(key)) {
        localStorage.setItem(key, JSON.stringify(params[key]))
      }
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
