// import Auth from '@aws-amplify/auth'

const getDefaultState = () => ({
  signInStatus: true,
  signInTitle: '',
  signInMsg: '',
  signInMsgType: 'success'
})

const state = getDefaultState

const getters = {
  getStates (state) {
    return state
  }
}

const actions = {
  signIn (ctx, data) {
    ctx.commit('resetStates')
    return new Promise((resolve, reject) => {
      this.$AWS.Auth.signIn({
        username: data.email,
        password: data.password
      })
        .then((user) => {
          const params = {
            signInStatus: true
          }
          ctx.commit('setState', { params })
          // this.$router.push(`email_verification/${data.email}`)
          resolve()
        })
        .catch((err) => {
          switch (err.code) {
            // Email invalido o no registrado
            case 'UserNotFoundException': {
              const params = {
                signInStatus: false,
                signInMsgType: 'error',
                signInTitle: '¡Correo no registrado!',
                signInMsg: 'El correo electrónico ingresado no se encuentra registrado.'
              }
              ctx.commit('setState', { params })
              resolve()
              break
            }

            // Contraseña incorrecta
            case 'NotAuthorizedException': {
              const params = {
                signInStatus: false,
                signInMsgType: 'error',
                signInTitle: '¡Contraseña incorrecta!',
                signInMsg: 'La contraseña ingresada es incorrecta.'
              }
              ctx.commit('setState', { params })
              resolve()
              break
            }

            // Email sin verificar
            case 'UserNotConfirmedException':
              this.$router.push(`/email_verification/${data.email}`)
              resolve()
              break

            // Error desconocido
            default: {
              const params = {
                signInStatus: false,
                signInMsgType: 'error',
                signInTitle: '¡Ups!',
                signInMsg: 'Algo inesperado ha sucedido. Inténtalo más tarde.'
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
