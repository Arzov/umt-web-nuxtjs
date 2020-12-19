const actions = {
  recoverPassword (ctx, data) {
    ctx.commit('global/resetStates', {}, { root: true })

    return new Promise((resolve, reject) => {
      this.$AWS.Auth.forgotPassword(
        data.email
      )
        .then(() => {
          this.$router.push(`/reset_password/${data.email}`)
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
                notificationMsg: 'El correo electrónico ingresado es incorrecto o no se encuentra en nuestros registros.'
              }
              break
            }

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
