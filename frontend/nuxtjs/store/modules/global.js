const getLocalStorageState = key => (localStorage.getItem(key))

const getDefaultState = () => ({
  themePreference: getLocalStorageState('themePreference') || 'dark',
  notificationTitle: '',
  notificationMsg: '',
  notificationMsgType: 'success',
  allowGeoloc: getLocalStorageState('allowGeoloc') || true
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

    if (ctx.getters.getGlobal.themePreference === 'light') {
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
        .then((result) => {
          resolve()
        })
        .catch((err) => {
          let params = {}

          switch (err.code) {
            // Error desconocido
            default: {
              params = {
                notificationMsgType: 'error',
                notificationTitle: '¡Ups!',
                notificationMsg: 'Algo inesperado ha sucedido. Inténtalo más tarde.'
              }
              break
            }
          }

          ctx.commit('setState', { params })
          reject(err)
        })
    })
  }
}

const mutations = {
  setState (state, { params }) {
    for (const key in params) {
      if (['themePreference', 'allowGeoloc'].includes(key)) {
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
