import errorNotification from '@/static/data/errorNotification.json'


// get default states values

const getDefaultState = () => ({
    themePreference : localStorage.getItem('themePreference') || '"dark"',
    allowGeoloc     : localStorage.getItem('allowGeoloc') || false
})


// state

const state = getDefaultState


// getters

const getters = {

    get (state) {

        // parse all state

        const parseState = { ...state }

        Object.keys(parseState).map(function (key, index) {
            parseState[key] = JSON.parse(parseState[key])
        })

        return parseState

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

        // save and stringify all elements to be reactive

        for (const key in params) {

            // save to localStorage

            localStorage.setItem(key, JSON.stringify(params[key]))


            // save to store

            state[key] = JSON.stringify(params[key])

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
