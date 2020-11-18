import Auth from '@aws-amplify/auth'

const getDefaultState = () => ({
  signUpStatus: true,
  signUpTitle: '',
  signUpMsg: '',
  signUpMsgType: 'success'
})

const state = getDefaultState

const getters = {
  getStates (state) {
    return state
  }
}

const actions = {
  signUp (ctx, data) {
    ctx.commit('resetStates')
    return new Promise((resolve, reject) => {
      const birthdate = `${data.birthdate.year}-${data.birthdate.month}-${data.birthdate.day}`

      Auth.signUp({
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
          this.$router.push(`/email_verification/${data.email}`)
          resolve()
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
                signUpMsg: 'Algo inesperado ha sucedido. Inténtalo más tarde.'
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
