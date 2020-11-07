const getDefaultState = () => ({
  signInStatus: false,
  signInTitle: '',
  signInMsg: ''
})

const state = getDefaultState

const getters = {
  getStart (state) {
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
                signInTitle: '¡Correo no registrado!',
                signInMsg: 'El correo electrónico que ingresaste no se encuentra registrado.'
              }
              ctx.commit('setState', { params })
              resolve()
              break
            }

            // Contraseña incorrecta
            case 'NotAuthorizedException':
              console.log(err.message)
              break

            // Email sin verificar
            case 'UserNotConfirmedException':
              console.log(err.message)
              // this.$router.push(process.env.routes.email_verification.path)
              break

            // Error desconocido
            default:
              console.log('¡Error desconocido!')
              break
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
