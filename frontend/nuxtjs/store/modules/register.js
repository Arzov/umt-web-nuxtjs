const getDefaultState = () => ({
  signUpStatus: false,
  signUpTitle: '',
  signUpMsg: '',
  signUpMsgType: 'error'
})

const state = getDefaultState

const getters = {
  getStates (state) {
    return state
  }
}

const actions = {
  signUp (ctx, data) {
    return new Promise((resolve, reject) => {
      const birthdate = `${data.birthdate.year}-${data.birthdate.month}-${data.birthdate.day}`

      this.$AWS.Auth.signUp({
        username: data.email,
        password: data.password,
        attributes: {
          email: data.email,
          name: data.firstName,
          birthdate,
          gender: data.gender
        }
      })
        .then((result) => {
          console.log(result)
          // const params = {
          //   name: data.name,
          //   birthdate,
          //   gender: data.gender,
          //   email: data.email.toLowerCase(),
          //   verified: false
          // }

          // ctx.commit('user/setState', { params }, { root: true })

        // this.$router.push(process.env.routes.email_verification.path)
        })
        .catch((err) => {
          switch (err.code) {
          // Validación desde lambda PreSignup
            case 'UserLambdaValidationException': {
              const params = {
                signUpStatus: false,
                signUpMsgType: 'warning',
                signUpTitle: '¡Correo ya registrado!',
                signUpMsg: err.message.split('#')[1]
              }
              ctx.commit('setState', { params })
              resolve()
              break
            }

            // Usuario ya existe
            case 'UsernameExistsException': {
              const params = {
                signUpStatus: false,
                signUpMsgType: 'warning',
                signUpTitle: '¡Correo ya registrado!',
                signUpMsg: 'El correo ya se encuentra registrado. Intenta iniciar sesión.'
              }
              ctx.commit('setState', { params })
              resolve()
              break
            }

            // Error desconocido
            default: {
              const params = {
                signUpStatus: false,
                signUpMsgType: 'error',
                signUpTitle: '¡Ups!',
                signUpMsg: 'Algo inesperado ha sucedido. Inténtalo de nuevo.'
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
