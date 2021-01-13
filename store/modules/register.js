import errorNotification from '@/static/data/errorNotification.json'

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
        .then(() => {
          this.$router.push(`/email_verification/${data.email}`)
          resolve()
        })
        .catch((err) => {
          let response = {}

          switch (err.code) {
            // Validación desde lambda PreSignup
            case 'UserLambdaValidationException': {
              response = {
                type: 'warning',
                title: '¡Correo ya registrado!',
                msg: err.message.split('#')[1]
              }
              break
            }

            // Usuario ya existe
            case 'UsernameExistsException': {
              response = {
                type: 'warning',
                title: '¡Correo ya registrado!',
                msg: 'El correo ya se encuentra registrado. Intenta iniciar sesión.'
              }
              break
            }

            // Error desconocido
            default: {
              response = errorNotification
              break
            }
          }

          response = { ...response, err }
          reject(response)
        })
    })
  }
}

export default {
  namespaced: true,
  actions
}
