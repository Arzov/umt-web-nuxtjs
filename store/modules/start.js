const actions = {
  signIn (ctx, data) {
    ctx.commit('global/resetStates', {}, { root: true })

    return new Promise((resolve, reject) => {
      this.$AWS.Auth.signIn({
        username: data.email,
        password: data.password
      })
        .then(() => {
          // TODO: agregar logica en middleware
          resolve()
        })
        .catch((err) => {
          let params = {}

          switch (err.code) {
            // Email invalido o no registrado
            case 'UserNotFoundException': {
              params = {
                notificationMsgType: 'error',
                notificationTitle: '¡Correo no registrado!',
                notificationMsg: 'El correo electrónico ingresado no se encuentra registrado.'
              }
              break
            }

            // Contraseña incorrecta
            case 'NotAuthorizedException': {
              params = {
                notificationMsgType: 'error',
                notificationTitle: '¡Contraseña incorrecta!',
                notificationMsg: 'La contraseña ingresada es incorrecta.'
              }
              break
            }

            // Email sin verificar
            case 'UserNotConfirmedException':
              this.$router.push(`/email_verification/${data.email}`)
              break

            // Error desconocido
            default: {
              params = {
                notificationMsgType: 'error',
                notificationTitle: '¡Ups!',
                notificationMsg: 'Algo inesperado ha sucedido. Inténtalo más tarde.'
              }
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
