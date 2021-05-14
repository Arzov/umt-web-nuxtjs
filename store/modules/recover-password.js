import errorNotification from '@/static/data/errorNotification.json'


// actions

const actions = {

    recover (ctx, data) {

        return new Promise((resolve, reject) => {

            this.$AWS.Auth.forgotPassword(data.email)

                // success
                .then(() => {
                    this.$router.push(`/reset_password/${data.email}`)

                    resolve()
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
                            msg     : `
                                El correo electrónico ingresado es incorrecto
                                o no se encuentra en nuestros registros.
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
