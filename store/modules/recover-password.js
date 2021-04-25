import errorNotification from '@/static/data/errorNotification.json'

const actions = {
    recover (ctx, data) {
        return new Promise((resolve, reject) => {
            this.$AWS.Auth.forgotPassword(data.email)
                .then(() => {
                    this.$router.push(`/reset_password/${data.email}`)
                    resolve()
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
                                El correo electrónico ingresado es incorrecto
                                o no se encuentra en nuestros registros.
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
