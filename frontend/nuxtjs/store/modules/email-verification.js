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
  verify (ctx, data) {
    ctx.commit('resetStates')
    return new Promise((resolve, reject) => {
      Auth.confirmSignUp(
        data.email,
        data.code,
        {
          forceAliasCreation: true
        }
      )
        .then((result) => {
          this.$router.push('/start')
          resolve()
        })
        .catch((err) => {
          switch (err.code) {
            // Correo ya validado
            case 'NotAuthorizedException': {
              const params = {
                confirmStatus: false,
                confirmMsgType: 'warning',
                confirmTitle: '¡Correo válido!',
                confirmMsg: 'El correo ya se encuentra validado. Intenta iniciar sesión.'
              }
              ctx.commit('setState', { params })
              resolve()
              break
            }

            // Correo invalido
            case 'UserNotFoundException': {
              const params = {
                confirmStatus: false,
                confirmMsgType: 'error',
                confirmTitle: '¡Correo incorrecto!',
                confirmMsg: 'El correo electrónico ingresado es incorrecto.'
              }
              ctx.commit('setState', { params })
              resolve()
              break
            }

            // Codigo invalido o caracter invalido
            case 'CodeMismatchException':
            case 'InvalidParameterException': {
              const params = {
                confirmStatus: false,
                confirmMsgType: 'error',
                confirmTitle: '¡Código incorrecto!',
                confirmMsg: 'El código ingresado es incorrecto.'
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
    })
  },
  resendCode (ctx, data) {
    ctx.commit('resetStates')
    return new Promise((resolve, reject) => {
      Auth.resendSignUp(
        data.email
      )
        .then((result) => {
          const params = {
            confirmStatus: false,
            confirmMsgType: 'success',
            confirmTitle: '¡Código enviado!',
            confirmMsg: `Un nuevo código de verificación fue enviado a ${data.email}.`
          }
          ctx.commit('setState', { params })
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
                confirmMsg: 'El correo electrónico ingresado es incorrecto.'
              }
              ctx.commit('setState', { params })
              resolve()
              break
            }

            // El correo ya se encuentra validado
            case 'InvalidParameterException': {
              const params = {
                confirmStatus: false,
                confirmMsgType: 'warning',
                confirmTitle: '¡Correo válido!',
                confirmMsg: 'El correo ya se encuentra validado. Intenta iniciar sesión.'
              }
              ctx.commit('setState', { params })
              resolve()
              break
            }

            // Limite de reenvios alcanzados
            case 'LimitExceededException': {
              const params = {
                confirmStatus: false,
                confirmMsgType: 'warning',
                confirmTitle: '¡Límite excedido!',
                confirmMsg: 'Has excedido el límite de solicitudes por día. Inténtalo más tarde.'
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
    })
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
