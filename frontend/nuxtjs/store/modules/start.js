const actions = {
  signIn (ctx, data) {
    this.$AWS.Auth.signIn({
      username: data.email,
      password: data.password
    })
      .then((user) => {
        console.log('Bien!')
        // this.$router.push(process.env.routes.home.path)
      })
      .catch((err) => {
        switch (err.code) {
          // Email invalido o no registrado
          case 'UserNotFoundException':
            console.log(err.message)
            break

          // Contraseña incorrecta
          case 'NotAuthorizedException':
            console.log(err.message)
            break

          // Email sin verificar
          case 'UserNotConfirmedException':
            console.log(err.message)
            // this.$router.push(process.env.routes.email_verification.path)
            break

          // Error desconocido
          default:
            console.log('¡Error desconocido!')
            break
        }
      })
  }
}

export default {
  namespaced: true,
  actions
}
