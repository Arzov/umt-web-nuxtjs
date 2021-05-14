import { graphqlOperation } from '@aws-amplify/api'
import { arv, umt } from '@/graphql/gql'
import errorNotification from '@/static/data/errorNotification.json'
import awsconfig from '~/aws-exports'


// get default states values

const getDefaultState = () => ({


    // dynamoDB

    email           : localStorage.getItem('email') || null,
    firstName       : localStorage.getItem('firstName') || null,
    lastName        : localStorage.getItem('lastName') || null,
    birthdate       : localStorage.getItem('birthdate') || null,
    gender          : localStorage.getItem('gender') || null,
    picture         : localStorage.getItem('picture') || null,
    coords          : localStorage.getItem('coords') || null,
    geohash         : localStorage.getItem('geohash') || null,
    matchFilter     : localStorage.getItem('matchFilter') || '[]',
    ageMinFilter    : localStorage.getItem('ageMinFilter') || null,
    ageMaxFilter    : localStorage.getItem('ageMaxFilter') || null,
    positions       : localStorage.getItem('positions') || '[]',
    foot            : localStorage.getItem('foot') || null,
    skills          : localStorage.getItem('skills') || null,
    weight          : localStorage.getItem('weight') || 0,
    height          : localStorage.getItem('height') || 0,
    providerId      : localStorage.getItem('providerId') || null,
    providers       : localStorage.getItem('providers') || '[]',
    joinedOn        : localStorage.getItem('joinedOn') || null,
    verified        : localStorage.getItem('verified') || null,


    // local

    teams       : localStorage.getItem('teams') || '[]',
    primaryTeam : localStorage.getItem('primaryTeam') || null
})


// state

const state = getDefaultState()


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

    fetch (ctx, data) {

        return new Promise((resolve, reject) => {

            // get arzov user information

            this.$AWS.Amplify.configure(awsconfig.arv)

            this.$AWS.API.graphql(
                graphqlOperation(arv.queries.getUser, {
                    email: data.email
                })
            )

                // success
                .then((result) => {

                    let userData = result.data.getUser

                    const params = {
                        email       : userData.email,
                        firstName   : userData.firstName,
                        lastName    : userData.lastName,
                        birthdate   : userData.birthdate,
                        gender      : userData.gender,
                        picture     : userData.picture,
                        providerId  : JSON.parse(userData.providerId),
                        providers   : userData.providers,
                        joinedOn    : userData.joinedOn,
                        verified    : userData.verified
                    }


                    // TODO: Upload image to S3 logic

                    // save in store

                    ctx.commit('setState', { params })


                    // get umatch user information

                    this.$AWS.Amplify.configure(awsconfig.umt)

                    this.$AWS.API.graphql(
                        graphqlOperation(umt.queries.getUser, {
                            email: data.email
                        })
                    )

                        // success
                        .then((result) => {

                            userData = result.data.getUser

                            const params = {
                                geohash         : userData.geohash || null,
                                coords          : JSON.parse(userData.coords) || null,
                                ageMinFilter    : userData.ageMinFilter || null,
                                ageMaxFilter    : userData.ageMaxFilter || null,
                                matchFilter     : userData.matchFilter || null,
                                positions       : userData.positions || null,
                                foot            : userData.foot || null,
                                skills          : JSON.parse(userData.skills) || null,
                                weight          : userData.weight || 0,
                                height          : userData.height || 0
                            }

                            // save in store

                            ctx.commit('setState', { params })

                            resolve()
                        })


                        // error
                        .catch((err) => {

                            const response = { ...errorNotification, err }

                            reject(response)
                        })
                })


                // error
                .catch((err) => {

                    const response = { ...errorNotification, err }

                    reject(response)
                })
        })
    },


    update (ctx, data) {

        // user state

        const userState = ctx.getters.get


        // update arzov information

        if (data.api === 'arv') {

            return new Promise((resolve, reject) => {

                // format birthdate

                const birthdate = `
                    ${data.birthdate.year}-${data.birthdate.month}-${data.birthdate.day}
                `

                // call backend AWS

                this.$AWS.Amplify.configure(awsconfig.arv)

                this.$AWS.API.graphql(
                    graphqlOperation(arv.mutations.updateUser, {
                        email       : data.email,
                        gender      : data.gender,
                        firstName   : data.firstName,
                        lastName    : data.lastName || '',
                        picture     : data.picture || '',
                        providerId  : JSON.stringify(userState.providerId),
                        providers   : userState.providers,
                        joinedOn    : userState.joinedOn,
                        verified    : userState.verified,
                        birthdate
                    })
                )

                    // success
                    .then(() => {

                        const params = {
                            birthdate,
                            gender  : data.gender,
                            picture : data.picture || ''
                        }

                        ctx.commit('setState', { params })
                        resolve()
                    })


                    // error
                    .catch((err) => {
                        const response = { ...errorNotification, err }

                        reject(response)
                    })
            })
        }


        // update umatch information

        else {

            return new Promise((resolve, reject) => {

                this.$AWS.Amplify.configure(awsconfig.umt)

                this.$AWS.API.graphql(
                    graphqlOperation(umt.mutations.updateUser, {
                        latitude        : data.latitude,
                        longitude       : data.longitude,
                        email           : data.email,
                        ageMinFilter    : data.ageMinFilter,
                        ageMaxFilter    : data.ageMaxFilter,
                        matchFilter     : data.matchFilter,
                        positions       : data.positions,
                        skills          : JSON.stringify(data.skills),
                        foot            : data.foot,
                        weight          : data.weight,
                        height          : data.height
                    })
                )

                    // success
                    .then((result) => {

                        const userData = result.data.updateUser

                        const params = {
                            geohash         : userData.geohash,
                            coords          : JSON.parse(userData.coords),
                            ageMinFilter    : userData.ageMinFilter,
                            ageMaxFilter    : userData.ageMaxFilter,
                            matchFilter     : userData.matchFilter,
                            positions       : userData.positions,
                            foot            : userData.foot,
                            skills          : JSON.parse(userData.skills),
                            weight          : userData.weight,
                            height          : userData.height
                        }

                        ctx.commit('setState', { params })
                        resolve()
                    })


                    // error
                    .catch((err) => {
                        const response = { ...errorNotification, err }

                        reject(response)
                    })
            })
        }
    },


    listTeams (ctx) {

        const userState = ctx.getters.get


        // fetch user's teams only if have `null` in store (optimizing request)

        if (!userState.teams || !userState.primaryTeam) {

            return new Promise((resolve, reject) => {

                this.$AWS.Amplify.configure(awsconfig.umt)

                this.$AWS.API.graphql(
                    graphqlOperation(umt.queries.listTeams, {
                        email: userState.email
                    })
                )

                    // success
                    .then((result) => {

                        const teams = result.data.listTeams.items

                        // set teams in store and default `primaryTeam`

                        if (teams) {

                            const params = {
                                teams,
                                primaryTeam: teams[0]
                            }

                            ctx.commit('setState', { params })
                            resolve()
                        }

                        // user belong to no teams yet

                        else {
                            resolve()
                        }
                    })


                    // error
                    .catch((err) => {
                        const response = { ...errorNotification, err }
                        reject(response)
                    })
            })
        }
    },


    resetStates (ctx) {
        ctx.commit('resetStates')
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

        for (const key in state) {

            // remove from localStorage

            localStorage.removeItem(key)


            // remove from store

            Object.assign(state, getDefaultState())
        }
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
