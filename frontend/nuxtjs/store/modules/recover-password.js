import Auth from '@aws-amplify/auth'

const getDefaultState = () => ({
  confirmStatus: true,
  confirmTitle: '',
  confirmMsg: '',
  confirmMsgType: 'success'
})

const state = getDefaultState

const getters = {
  getStates (state) {
    return state
  }
}

const actions = {
  recoverPassword (ctx, data) {
    ctx.commit('resetStates')
    return new Promise((resolve, reject) => {
      Auth.forgotPassword(
        data.email
      )
        .then(() => {
          this.$router.push('/start')
          resolve()
        })
        .catch((err) => {
          switch (err.code) {
            // Correo invalido
            case 'UserNotFoundException': {
              const params = {
                confirmStatus: false,
                confirmMsgType: 'error',
                confirmTitle: '¡Correo incorrecto!',
                confirmMsg: 'El correo electrónico ingresado es incorrecto o no se encuentra en nuestros registros.'
              }
              ctx.commit('setState', { params })
              resolve()
              break
            }

            // Error desconocido
            default: {
              const params = {
                confirmStatus: false,
                confirmMsgType: 'error',
                confirmTitle: '¡Ups!',
                confirmMsg: 'Algo inesperado ha sucedido. Inténtalo más tarde.'
              }
              ctx.commit('setState', { params })
              resolve()
              break
            }
          }
        })
    }
    )
  }
}

const mutations = {
  setState (state, { params }) {
    for (const key in params) {
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
