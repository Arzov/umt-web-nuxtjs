const getDefaultState = () => ({
  signInStatus: false,
  signInTitle: '',
  signInMsg: '',
  signInMsgType: 'error'
})

const state = getDefaultState

const getters = {
  getStates (state) {
    return state
  }
}

const actions = {
  signIn (ctx, data) {
    return new Promise((resolve, reject) => {
      this.$AWS.Auth.signIn({
        username: data.email,
        password: data.password
      })
        .then((user) => {
          console.log('Bien!')
        // this.$router.push(process.env.routes.home.path)
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
              console.log(err.message)
              // this.$router.push(process.env.routes.email_verification.path)
              break

            // Error desconocido
            default: {
              const params = {
                signInStatus: false,
                signInMsgType: 'error',
                signInTitle: '¡Ups!',
                signInMsg: 'Algo inesperado ha sucedido. Inténtalo de nuevo.'
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
