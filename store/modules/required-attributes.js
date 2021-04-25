import errorNotification from '@/static/data/errorNotification.json'

const actions = {
    save (ctx, data) {
        return new Promise((resolve, reject) => {
            ctx.dispatch(
                'user/update',
                {
                    api: 'arv',
                    email: data.email,
                    birthdate: data.birthdate,
                    gender: data.gender,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    picture: data.picture
                },
                { root: true }
            )
                .then(() => {
                    this.$router.push('/home')
                    resolve()
                })
                .catch((err) => {
                    const response = { ...errorNotification, err }
                    reject(response)
                })
        })
    }
}

export default {
    namespaced: true,
    actions
}
