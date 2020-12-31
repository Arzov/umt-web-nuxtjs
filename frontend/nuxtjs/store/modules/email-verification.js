import errorNotification from '@/static/data/errorNotification.json'

const actions = {
  verify (ctx, data) {
    ctx.commit('global/resetStates', {}, { root: true })

    return new Promise((resolve, reject) => {
      this.$AWS.Auth.confirmSignUp(
        data.email,
        data.code,
        {
          forceAliasCreation: true
        }
      )
        .then(() => {
          this.$router.push('/start')
          resolve()
        })
        .catch((err) => {
          let params = {}

          switch (err.code) {
            // Correo ya validado
            case 'NotAuthorizedException': {
              params = {
                notificationMsgType: 'warning',
                notificationTitle: '¡Correo válido!',
                notificationMsg: 'El correo ya se encuentra validado. Intenta iniciar sesión.'
              }
              break
            }

            // Correo invalido
            case 'UserNotFoundException': {
              params = {
                notificationMsgType: 'error',
                notificationTitle: '¡Correo incorrecto!',
                notificationMsg: 'El correo electrónico ingresado es incorrecto.'
              }
              break
            }

            // Codigo invalido o caracter invalido
            case 'CodeMismatchException':
            case 'InvalidParameterException': {
              params = {
                notificationMsgType: 'error',
                notificationTitle: '¡Código incorrecto!',
                notificationMsg: 'El código ingresado es incorrecto.'
              }
              break
            }

            // Limite de reenvios alcanzados
            case 'LimitExceededException': {
              params = {
                notificationMsgType: 'warning',
                notificationTitle: '¡Límite excedido!',
                notificationMsg: 'Has excedido el límite de solicitudes por día. Inténtalo más tarde.'
              }
              break
            }

            // Error desconocido
            default: {
              params = errorNotification
              break
            }
          }

          ctx.commit('global/setState', { params }, { root: true })
          reject(err)
        })
    })
  },
  resendCode (ctx, data) {
    ctx.commit('global/resetStates', {}, { root: true })

    return new Promise((resolve, reject) => {
      this.$AWS.Auth.resendSignUp(
        data.email
      )
        .then(() => {
          const params = {
            notificationMsgType: 'success',
            notificationTitle: '¡Código enviado!',
            notificationMsg: `Un nuevo código de verificación fue enviado a ${data.email}.`
          }
          ctx.commit('global/setState', { params }, { root: true })
          resolve()
        })
        .catch((err) => {
          let params = {}

          switch (err.code) {
            // Correo invalido
            case 'UserNotFoundException': {
              params = {
                notificationMsgType: 'error',
                notificationTitle: '¡Correo incorrecto!',
                notificationMsg: 'El correo electrónico ingresado es incorrecto.'
              }
              break
            }

            // El correo ya se encuentra validado
            case 'InvalidParameterException': {
              params = {
                notificationMsgType: 'warning',
                notificationTitle: '¡Correo válido!',
                notificationMsg: 'El correo ya se encuentra validado. Intenta iniciar sesión.'
              }
              break
            }

            // Limite de reenvios alcanzados
            case 'LimitExceededException': {
              params = {
                notificationMsgType: 'warning',
                notificationTitle: '¡Límite excedido!',
                notificationMsg: 'Has excedido el límite de solicitudes por día. Inténtalo más tarde.'
              }
              break
            }

            // Error desconocido
            default: {
              params = errorNotification
              break
            }
          }

          ctx.commit('global/setState', { params }, { root: true })
          reject(err)
        })
    })
  }
}

export default {
  namespaced: true,
  actions
}
