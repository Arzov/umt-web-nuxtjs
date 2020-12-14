import Auth from '@aws-amplify/auth'

const getLocalStorageState = key => (localStorage.getItem(key))

const getDefaultState = () => ({
  themePreference: getLocalStorageState('themePreference')
    ? getLocalStorageState('themePreference') : 'dark',
  signOutStatus: true,
  signOutTitle: '',
  signOutMsg: '',
  signOutMsgType: 'success'
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
      Auth.signOut()
        .then((result) => {
          console.log('log out del store')
          resolve()
        })
        .catch((err) => {
          switch (err.code) {
            // Error desconocido
            default: {
              const params = {
                signOutStatus: false,
                signOutMsgType: 'error',
                signOutTitle: '¡Ups!',
                signOutMsg: 'Algo inesperado ha sucedido. Inténtalo más tarde.'
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
