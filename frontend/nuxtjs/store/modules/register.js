const actions = {
  signUp (ctx, data) {
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
      .then((result) => {
        console.log(result)
        // const params = {
        //   name: data.name,
        //   birthdate,
        //   gender: data.gender,
        //   email: data.email.toLowerCase(),
        //   verified: false
        // }

        // ctx.commit('user/setState', { params }, { root: true })

        // this.$router.push(process.env.routes.email_verification.path)
      })
      .catch((err) => {
        switch (err.code) {
          // Problema con trigger lambda PreSignUp
          case 'UserLambdaValidationException':
            console.log(err.message.split('#')[1])
            break

          // Usuario ya existe
          case 'UsernameExistsException':
            console.log(err.message)
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
