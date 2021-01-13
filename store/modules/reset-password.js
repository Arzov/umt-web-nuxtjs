import errorNotification from '@/static/data/errorNotification.json'

const actions = {
  reset (ctx, data) {
    return new Promise((resolve, reject) => {
      this.$AWS.Auth.forgotPasswordSubmit(
        data.email,
        data.code,
        data.password
      )
        .then(() => {
          this.$router.push('/start')
          resolve()
        })
        .catch((err) => {
          let response = {}

          switch (err.code) {
            // Codigo invalido
            case 'CodeMismatchException': {
              response = {
                type: 'error',
                title: '¡Código incorrecto!',
                msg: 'El código ingresado es incorrecto. Vuelve a intentarlo.'
              }
              break
            }

            // Codigo expirado
            case 'ExpiredCodeException': {
              response = {
                type: 'warning',
                title: '¡Código expirado!',
                msg: 'El código ingresado ya expiró. Vuelve a pedir otro código.'
              }
              break
            }

            // Correo invalido
            case 'UserNotFoundException': {
              response = {
                type: 'error',
                title: '¡Correo incorrecto!',
                msg: 'El correo electrónico ingresado es incorrecto.'
              }
              break
            }

            // Limite de reenvios alcanzados
            case 'LimitExceededException': {
              response = {
                type: 'warning',
                title: '¡Límite excedido!',
                msg: 'Has excedido el límite de solicitudes por día. Inténtalo más tarde.'
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
  },
  resendCode (ctx, data) {
    return new Promise((resolve, reject) => {
      this.$AWS.Auth.forgotPassword(
        data.email
      )
        .then(() => {
          const response = {
            type: 'success',
            title: '¡Código enviado!',
            msg: `Un nuevo código fue enviado a ${data.email}.`
          }
          resolve(response)
        })
        .catch((err) => {
          let response = {}

          switch (err.code) {
            // Correo invalido
            case 'UserNotFoundException': {
              response = {
                type: 'error',
                title: '¡Correo incorrecto!',
                msg: 'El correo electrónico ingresado es incorrecto.'
              }
              break
            }

            // Limite de reenvios alcanzados
            case 'LimitExceededException': {
              response = {
                type: 'warning',
                title: '¡Límite excedido!',
                msg: 'Has excedido el límite de solicitudes por día. Inténtalo más tarde.'
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
