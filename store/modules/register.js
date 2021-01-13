const actions = {
  signUp (ctx, data) {
    ctx.commit('global/resetStates', {}, { root: true })

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
          let params = {}

          switch (err.code) {
            // Validación desde lambda PreSignup
            case 'UserLambdaValidationException': {
              params = {
                notificationMsgType: 'warning',
                notificationTitle: '¡Correo ya registrado!',
                notificationMsg: err.message.split('#')[1]
              }
              break
            }

            // Usuario ya existe
            case 'UsernameExistsException': {
              params = {
                notificationMsgType: 'warning',
                notificationTitle: '¡Correo ya registrado!',
                notificationMsg: 'El correo ya se encuentra registrado. Intenta iniciar sesión.'
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
