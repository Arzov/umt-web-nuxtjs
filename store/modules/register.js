import errorNotification from '@/static/data/errorNotification.json'


// actions

const actions = {

    signUp (ctx, data) {

        return new Promise((resolve, reject) => {

            // format birthdate in `YYYY-MM-DD`

            const birthdate = `
                ${data.birthdate.year}-${data.birthdate.month}-${data.birthdate.day}
            `


            // signup

            this.$AWS.Auth.signUp({
                username: data.email,
                password: data.password,
                attributes: {
                    email   : data.email,
                    name    : data.firstName,
                    gender  : data.gender,
                    birthdate
                }
            })

                // success
                .then(() => {
                    this.$router.push(`/email_verification/${data.email}`)

                    resolve()
                })


                // error
                .catch((err) => {

                    let response = {}

                    switch (err.code) {

                    // AWS Lambda PreSignup validation

                    case 'UserLambdaValidationException': {
                        response = {
                            type    : 'warning',
                            title   : '¡Correo ya registrado!',
                            msg     : err.message.split('#')[1]
                        }
                        break
                    }


                    // user already exist

                    case 'UsernameExistsException': {
                        response = {
                            type    : 'warning',
                            title   : '¡Correo ya registrado!',
                            msg     : `
                                El correo ya se encuentra registrado.
                                Intenta iniciar sesión.
                            `
                        }
                        break
                    }


                    // unknown error

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


// export modules

export default {
    namespaced: true,
    actions
}
