import errorNotification from '@/static/data/errorNotification.json'


// actions

const actions = {

    reset (ctx, data) {

        return new Promise((resolve, reject) => {

            this.$AWS.Auth.forgotPasswordSubmit(
                data.email,
                data.code,
                data.password
            )

                // success
                .then(() => {
                    this.$router.push('/start')
                    resolve()
                })


                // error
                .catch((err) => {

                    let response = {}

                    switch (err.code) {

                    // invalid code

                    case 'CodeMismatchException': {
                        response = {
                            type    : 'error',
                            title   : '¡Código incorrecto!',
                            msg     : `
                                El código ingresado es incorrecto.
                                Vuelve a intentarlo.
                            `
                        }
                        break
                    }

                    // expired code

                    case 'ExpiredCodeException': {
                        response = {
                            type    : 'warning',
                            title   : '¡Código expirado!',
                            msg     : `
                                El código ingresado ya expiró.
                                Vuelve a pedir otro código.
                            `
                        }
                        break
                    }

                    // invalid email

                    case 'UserNotFoundException': {
                        response = {
                            type    : 'error',
                            title   : '¡Correo incorrecto!',
                            msg     : `
                                El correo electrónico ingresado es incorrecto.
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

    },


    resendCode (ctx, data) {

        return new Promise((resolve, reject) => {

            this.$AWS.Auth.forgotPassword(data.email)

                // success
                .then(() => {

                    const response = {
                        type    : 'success',
                        title   : '¡Código enviado!',
                        msg     : `
                            Un nuevo código fue enviado a ${data.email}.
                        `
                    }

                    resolve(response)
                })


                // error
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
