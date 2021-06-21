import errorNotification from '@/static/data/errorNotification.json'


// actions

const actions = {

    signIn (ctx, data) {
        return new Promise((resolve, reject) => {

            this.$AWS.Auth.signIn({
                username: data.email,
                password: data.password
            })

                // success
                .then(() => {
                    resolve()
                })


                // error
                .catch((err) => {

                    let response = {}

                    switch (err.code) {

                    // invalid email or not registered

                    case 'UserNotFoundException': {
                        response = {
                            type    : 'error',
                            title   : '¡Correo no registrado!',
                            msg     : `
                                El correo electrónico ingresado no se
                                encuentra registrado.
                            `
                        }
                        break
                    }

                    // wrong password

                    case 'NotAuthorizedException': {
                        response = {
                            type    : 'error',
                            title   : '¡Contraseña incorrecta!',
                            msg     : 'La contraseña ingresada es incorrecta.'
                        }
                        break
                    }

                    // email unverified

                    case 'UserNotConfirmedException': {
                        this.$router.push(`/email_verification/${data.email}`)
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
