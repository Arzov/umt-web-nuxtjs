import errorNotification from '@/static/data/errorNotification.json'

const actions = {
  signIn (ctx, data) {
    return new Promise((resolve, reject) => {
      this.$AWS.Auth.signIn({
        username: data.email,
        password: data.password
      })
        .then(() => {
          resolve()
        })
        .catch((err) => {
          let response = {}

          switch (err.code) {
            // Email invalido o no registrado
            case 'UserNotFoundException': {
              response = {
                type: 'error',
                title: '¡Correo no registrado!',
                msg: 'El correo electrónico ingresado no se encuentra registrado.'
              }
              break
            }

            // Contraseña incorrecta
            case 'NotAuthorizedException': {
              response = {
                type: 'error',
                title: '¡Contraseña incorrecta!',
                msg: 'La contraseña ingresada es incorrecta.'
              }
              break
            }

            // Email sin verificar
            case 'UserNotConfirmedException':
              this.$router.push(`/email_verification/${data.email}`)
              break

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
