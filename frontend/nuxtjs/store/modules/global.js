const getLocalStorageState = key => (localStorage.getItem(key))

const getDefaultState = () => ({
  themePreference: getLocalStorageState('themePreference')
    ? getLocalStorageState('themePreference') : 'dark',
  notificationTitle: '',
  notificationMsg: '',
  notificationMsgType: 'success'
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
  },
  signOut (ctx, data) {
    ctx.commit('resetStates')
    return new Promise((resolve, reject) => {
      this.$AWS.Auth.signOut()
        .then((result) => {
          console.log('log out del store')
          resolve()
        })
        .catch((err) => {
          switch (err.code) {
            // Error desconocido
            default: {
              const params = {
                notificationMsgType: 'error',
                notificationTitle: '¡Ups!',
                notificationMsg: 'Algo inesperado ha sucedido. Inténtalo más tarde.'
              }
              ctx.commit('setState', { params })
              resolve()
              break
            }
          }
        })
    })
  }
}

const mutations = {
  setState (state, { params }) {
    for (const key in params) {
      if (key === 'themePreference') {
        localStorage.setItem(key, params[key])
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
