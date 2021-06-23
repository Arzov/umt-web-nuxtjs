import errorNotification from '@/static/data/errorNotification.json'


// actions

const actions = {

    verify (ctx, data) {

        return new Promise((resolve, reject) => {

            this.$AWS.Auth.confirmSignUp(data.email, data.code, {
                forceAliasCreation: true
            })

                // success validation
                .then(() => {

                    // TODO: should show a success notification before redirect
                    this.$router.push('/start')

                    resolve()
                })


                // error in validation
                .catch((err) => {

                    let response = {}

                    switch (err.code) {

                    // email already validated

                    case 'NotAuthorizedException': {
                        response = {
                            type    : 'warning',
                            title   : '¡Correo válido!',
                            msg     : `
                                El correo ya se encuentra validado.
                                Intenta iniciar sesión.
                            `
                        }
                        break
                    }


                    // invalid email

                    case 'UserNotFoundException': {
                        response = {
                            type    : 'error',
                            title   : '¡Correo incorrecto!',
                            msg     : 'El correo electrónico ingresado es incorrecto.'
                        }
                        break
                    }


                    // wrong code or bad character

                    case 'CodeMismatchException':
                    case 'InvalidParameterException': {
                        response = {
                            type    : 'error',
                            title   : '¡Código incorrecto!',
                            msg     : 'El código ingresado es incorrecto.'
                        }
                        break
                    }


                    // resend limit exceeded

                    case 'LimitExceededException': {
                        response = {
                            type    : 'warning',
                            title   : '¡Límite excedido!',
                            msg     : `
                                Has excedido el límite de solicitudes por día.
                                Inténtalo más tarde.
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

    },


    resendCode (ctx, data) {

        return new Promise((resolve, reject) => {

            this.$AWS.Auth.resendSignUp(data.email)


                // success resend code
                .then(() => {
                    const response = {
                        type    : 'success',
                        title   : '¡Código enviado!',
                        msg     : `
                            Un nuevo código de verificación fue enviado a
                            ${data.email}.
                        `
                    }

                    resolve(response)
                })


                // error request
                .catch((err) => {

                    let response = {}

                    switch (err.code) {


                    // invalid email

                    case 'UserNotFoundException': {
                        response = {
                            type    : 'error',
                            title   : '¡Correo incorrecto!',
                            msg     : 'El correo electrónico ingresado es incorrecto.'
                        }
                        break
                    }


                    // email already validated

                    case 'InvalidParameterException': {
                        response = {
                            type    : 'warning',
                            title   : '¡Correo válido!',
                            msg     : `
                                El correo ya se encuentra validado.
                                Intenta iniciar sesión.
                            `
                        }
                        break
                    }


                    // resend limit exceeded

                    case 'LimitExceededException': {
                        response = {
                            type    : 'warning',
                            title   : '¡Límite excedido!',
                            msg     : `
                                Has excedido el límite de solicitudes por día.
                                Inténtalo más tarde.
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
