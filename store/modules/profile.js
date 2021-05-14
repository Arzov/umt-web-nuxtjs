import errorNotification from '@/static/data/errorNotification.json'


// actions

const actions = {

    setPrimaryTeam (ctx, data) {

        const params = {
            primaryTeam: data
        }

        ctx.commit('user/setState', { params }, { root: true })
    },


    update (ctx, data) {

        // load states

        const userState = ctx.rootGetters['user/get']


        return new Promise((resolve, reject) => {

            let response = {}

            ctx.dispatch(
                'user/update',
                {
                    ...data,
                    email       : userState.email,
                    firstName   : userState.firstName,
                    lastName    : userState.lastName,
                    picture     : userState.picture,
                    api         : 'arv'
                },
                { root: true }
            )


                // success
                .then(() => {
                    ctx.dispatch(
                        'user/update',
                        {
                            ...data,
                            latitude        : userState.coords.LAT.N,
                            longitude       : userState.coords.LON.N,
                            email           : userState.email,
                            skills          : userState.skills,
                            ageMinFilter    : data.ageFilter[0],
                            ageMaxFilter    : data.ageFilter[1],
                            api             : 'umt'
                        },
                        { root: true }
                    )

                        // success
                        .then(() => {
                            resolve()
                        })


                        // error
                        .catch((err) => {
                            response = { ...errorNotification, err }

                            reject(response)
                        })
                })


                // error
                .catch((err) => {
                    response = { ...errorNotification, err }

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
