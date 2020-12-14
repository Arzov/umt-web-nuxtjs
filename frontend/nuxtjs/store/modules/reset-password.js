const getDefaultState = () => ({
  resetStatus: true,
  resetTitle: '',
  resetMsg: '',
  resetMsgType: 'success'
})

const state = getDefaultState

const getters = {
  getStates (state) {
    return state
  }
}

const actions = {
  reset (ctx, data) {
    ctx.commit('resetStates')
    return new Promise((resolve, reject) => {
      this.$AWS.Auth.forgotPasswordSubmit(
        data.email,
        data.code,
        data.password
      )
        .then((result) => {
          this.$router.push('/start')
          resolve()
        })
        .catch((err) => {
          switch (err.code) {
            // Codigo invalido
            case 'CodeMismatchException': {
              const params = {
                resetStatus: false,
                resetMsgType: 'error',
                resetTitle: '¡Código incorrecto!',
                resetMsg: 'El código ingresado es incorrecto. Vuelve a intentarlo.'
              }
              ctx.commit('setState', { params })
              resolve()
              break
            }

            // Codigo expirado
            case 'ExpiredCodeException': {
              const params = {
                resetStatus: false,
                resetMsgType: 'warning',
                resetTitle: '¡Código expirado!',
                resetMsg: 'El código ingresado ya expiró. Vuelve a pedir otro código.'
              }
              ctx.commit('setState', { params })
              resolve()
              break
            }

            // Correo invalido
            case 'UserNotFoundException': {
              const params = {
                resetStatus: false,
                resetMsgType: 'error',
                resetTitle: '¡Correo incorrecto!',
                resetMsg: 'El correo electrónico ingresado es incorrecto.'
              }
              ctx.commit('setState', { params })
              resolve()
              break
            }

            // Limite de reenvios alcanzados
            case 'LimitExceededException': {
              const params = {
                resetStatus: false,
                resetMsgType: 'warning',
                resetTitle: '¡Límite excedido!',
                resetMsg: 'Has excedido el límite de solicitudes por día. Inténtalo más tarde.'
              }
              ctx.commit('setState', { params })
              resolve()
              break
            }

            // Error desconocido
            default: {
              const params = {
                resetStatus: false,
                resetMsgType: 'error',
                resetTitle: '¡Ups!',
                resetMsg: 'Algo inesperado ha sucedido. Inténtalo más tarde.'
              }
              ctx.commit('setState', { params })
              resolve()
              break
            }
          }
        })
    })
  },
  resendCode (ctx, data) {
    ctx.commit('resetStates')
    return new Promise((resolve, reject) => {
      this.$AWS.Auth.forgotPassword(
        data.email
      )
        .then((result) => {
          const params = {
            resetStatus: true,
            resetMsgType: 'success',
            resetTitle: '¡Código enviado!',
            resetMsg: `Un nuevo código fue enviado a ${data.email}.`
          }
          ctx.commit('setState', { params })
          resolve()
        })
        .catch((err) => {
          switch (err.code) {
            // Correo invalido
            case 'UserNotFoundException': {
              const params = {
                resetStatus: false,
                resetMsgType: 'error',
                resetTitle: '¡Correo incorrecto!',
                resetMsg: 'El correo electrónico ingresado es incorrecto.'
              }
              ctx.commit('setState', { params })
              resolve()
              break
            }

            // Limite de reenvios alcanzados
            case 'LimitExceededException': {
              const params = {
                resetStatus: false,
                resetMsgType: 'warning',
                resetTitle: '¡Límite excedido!',
                resetMsg: 'Has excedido el límite de solicitudes por día. Inténtalo más tarde.'
              }
              ctx.commit('setState', { params })
              resolve()
              break
            }

            // Error desconocido
            default: {
              const params = {
                resetStatus: false,
                resetMsgType: 'error',
                resetTitle: '¡Ups!',
                resetMsg: 'Algo inesperado ha sucedido. Inténtalo más tarde.'
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
