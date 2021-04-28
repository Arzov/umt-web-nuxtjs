import errorNotification from '@/static/data/errorNotification.json'


// parse localStorage function

const getLocalStorageState = key => JSON.parse(localStorage.getItem(key))


// get default states values

const getDefaultState = () => ({
    themePreference : getLocalStorageState('themePreference') || 'dark',
    allowGeoloc     : getLocalStorageState('allowGeoloc') || false
})


// state

const state = getDefaultState


// getters

const getters = {
    get (state) {
        return state
    }
}


// actions

const actions = {

    setTheme (ctx) {

        const params = {
            themePreference: 'dark'
        }


        // turn dark

        if (ctx.getters.get.themePreference === 'light') {
            ctx.commit('setState', { params })
        }


        // turn light

        else {
            params.themePreference = 'light'
            ctx.commit('setState', { params })
        }
    },


    setState (ctx, data) {
        const params = data

        ctx.commit('setState', { params })
    },


    resetStates (ctx) {
        ctx.commit('resetStates')
    },


    signOut (ctx, data) {

        // reset states

        ctx.commit('resetStates')
        ctx.commit('user/resetStates', {}, { root: true })


        // trigger signout event

        return new Promise((resolve, reject) => {

            this.$AWS.Auth.signOut()

                // success
                .then(() => {
                    resolve()
                })


                // error
                .catch((err) => {
                    const response = { ...errorNotification, err }

                    reject(response)
                })
        })
    }
}


// mutations

const mutations = {

    setState (state, { params }) {

        for (const key in params) {

            // set state in localStorage

            localStorage.setItem(key, JSON.stringify(params[key]))


            // set state in storage

            state[key] = params[key]
        }
    },


    resetStates (state) {
        Object.assign(state, getDefaultState())
    }
}


// export modules

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
