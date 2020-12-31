import errorNotification from '@/static/data/errorNotification.json'

const actions = {
  reset (ctx, data) {
    ctx.commit('global/resetStates', {}, { root: true })

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
          let params = {}

          switch (err.code) {
            // Codigo invalido
            case 'CodeMismatchException': {
              params = {
                notificationMsgType: 'error',
                notificationTitle: '¡Código incorrecto!',
                notificationMsg: 'El código ingresado es incorrecto. Vuelve a intentarlo.'
              }
              break
            }

            // Codigo expirado
            case 'ExpiredCodeException': {
              params = {
                notificationMsgType: 'warning',
                notificationTitle: '¡Código expirado!',
                notificationMsg: 'El código ingresado ya expiró. Vuelve a pedir otro código.'
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
      this.$AWS.Auth.forgotPassword(
        data.email
      )
        .then(() => {
          const params = {
            notificationMsgType: 'success',
            notificationTitle: '¡Código enviado!',
            notificationMsg: `Un nuevo código fue enviado a ${data.email}.`
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
