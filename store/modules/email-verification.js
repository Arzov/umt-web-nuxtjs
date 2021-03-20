import errorNotification from '@/static/data/errorNotification.json'

const actions = {
    verify (ctx, data) {
        return new Promise((resolve, reject) => {
            this.$AWS.Auth.confirmSignUp(
                data.email,
                data.code,
                {
                    forceAliasCreation: true
                }
            )
                .then(() => {
                    this.$router.push('/start')
                    resolve()
                })
                .catch((err) => {
                    let response = {}

                    switch (err.code) {
                    // Email already validated
                    case 'NotAuthorizedException': {
                        response = {
                            type: 'warning',
                            title: '¡Correo válido!',
                            msg: `
                                El correo ya se encuentra validado.
                                Intenta iniciar sesión.
                            `
                        }
                        break
                    }

                    // Invalid email
                    case 'UserNotFoundException': {
                        response = {
                            type: 'error',
                            title: '¡Correo incorrecto!',
                            msg: `
                                El correo electrónico ingresado es incorrecto.
                            `
                        }
                        break
                    }

                    // Wrong code or bad character
                    case 'CodeMismatchException':
                    case 'InvalidParameterException': {
                        response = {
                            type: 'error',
                            title: '¡Código incorrecto!',
                            msg: 'El código ingresado es incorrecto.'
                        }
                        break
                    }

                    // Resend limit exceeded
                    case 'LimitExceededException': {
                        response = {
                            type: 'warning',
                            title: '¡Límite excedido!',
                            msg: `
                                Has excedido el límite de solicitudes por día.
                                Inténtalo más tarde.
                            `
                        }
                        break
                    }

                    // Unknown error
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
            this.$AWS.Auth.resendSignUp(
                data.email
            )
                .then(() => {
                    const response = {
                        type: 'success',
                        title: '¡Código enviado!',
                        msg: `
                            Un nuevo código de verificación fue enviado a
                            ${data.email}.
                        `
                    }
                    resolve(response)
                })
                .catch((err) => {
                    let response = {}

                    switch (err.code) {
                    // Invalid email
                    case 'UserNotFoundException': {
                        response = {
                            type: 'error',
                            title: '¡Correo incorrecto!',
                            msg: `
                                El correo electrónico ingresado es incorrecto.
                            `
                        }
                        break
                    }

                    // Email already validated
                    case 'InvalidParameterException': {
                        response = {
                            type: 'warning',
                            title: '¡Correo válido!',
                            msg: `
                                El correo ya se encuentra validado.
                                Intenta iniciar sesión.
                            `
                        }
                        break
                    }

                    // Resend limit exceeded
                    case 'LimitExceededException': {
                        response = {
                            type: 'warning',
                            title: '¡Límite excedido!',
                            msg: `
                                Has excedido el límite de solicitudes por día.
                                Inténtalo más tarde.
                            `
                        }
                        break
                    }

                    // Unknown error
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

export default {
    namespaced: true,
    actions
}
