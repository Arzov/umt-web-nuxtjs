import { graphqlOperation } from '@aws-amplify/api'
import { umt } from '@/graphql/gql'
import errorNotification from '@/static/data/errorNotification.json'
import awsconfig from '~/aws-exports'


// get default state values

const getDefaultState = () => ({
    nearTeams                   : '[]',
    nearTeamsNextToken          : null,
    nearTeamsForJoin            : '[]',
    nearTeamsForJoinNextToken   : null,
    nearMatches                 : '[]',
    nearMatchesNextToken        : null
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

    nearTeams (ctx, data) {

        // load states

        const userState = ctx.rootGetters['user/get']
        const homeState = ctx.getters.get


        // if is not inifinite scroll, it's mean a new fresh request

        if (!data.isInfiniteScroll) {

            // refresh states

            ctx.commit('resetStates')
        }


        const ownTeams = userState.teams.length
            ? userState.teams.map((team) => {
                return team.id
            })

            : null


        // params to call AWS

        let params = {
            ownTeams,
            email   : userState.email,
            forJoin : data.forJoin,
            gender  : userState.gender,
            age     : this.$UTILS.getAgeFromDate(userState.birthdate)
        }


        params = data.forJoin
            ? {
                ...params,
                geohash         : userState.geohash,
                genderFilter    : [],
                ageMinFilter    : userState.ageMinFilter,
                ageMaxFilter    : userState.ageMaxFilter,
                matchFilter     : userState.matchFilter,
                nextToken       : homeState.nearTeamsForJoinNextToken
            }

            : {
                ...params,
                geohash         : userState.primaryTeam.geohash,
                genderFilter    : userState.primaryTeam.genderFilter,
                ageMinFilter    : userState.primaryTeam.ageMinFilter,
                ageMaxFilter    : userState.primaryTeam.ageMaxFilter,
                matchFilter     : userState.primaryTeam.matchFilter,
                nextToken       : homeState.nearTeamsNextToken
            }


        return new Promise((resolve, reject) => {

            this.$AWS.Amplify.configure(awsconfig.umt)

            this.$AWS.API.graphql(
                graphqlOperation(umt.queries.nearTeams, params)
            )

                // success
                .then((result) => {

                    const stateNearTeams = data.forJoin
                        ? homeState.nearTeamsForJoin
                        : homeState.nearTeams

                    const nearTeamsResult = result.data.nearTeams

                    // format new teams

                    nearTeamsResult.items = nearTeamsResult.items.map((team) => {
                        return {
                            ...team,
                            formation   : JSON.parse(team.formation),
                            coords      : JSON.parse(team.coords),
                            distance    : this.$UTILS.getDistance(
                                JSON.parse(team.coords).LAT.N,
                                JSON.parse(team.coords).LON.N,
                                userState.coords.LAT.N,
                                userState.coords.LON.N
                            )
                        }
                    })

                    // concat new teams loaded to state

                    const fullNearTeams = [
                        ...stateNearTeams,
                        ...nearTeamsResult.items
                    ]

                    // deduplicate teams (https://dev.to/marinamosti/removing-duplicates-in-an-array-of-objects-in-js-with-sets-3fep)

                    const nearTeams = fullNearTeams.reduce((acc, current) => {
                        const x = acc.find(item => item.id === current.id)

                        if (!x) {
                            return acc.concat([current])
                        }

                        else {
                            return acc
                        }
                    }, [])


                    // set nextToken

                    const nextToken = nearTeamsResult.nextToken

                    const params = data.forJoin
                        ? {
                            nearTeamsForJoin            : nearTeams,
                            nearTeamsForJoinNextToken   : nextToken
                        }

                        : {
                            nearTeams,
                            nearTeamsNextToken: nextToken
                        }


                    // save into store

                    ctx.commit('setState', { params })
                    resolve()
                })


                // error
                .catch((err) => {
                    const response = { ...errorNotification, err }

                    reject(response)
                })

        })
    },


    nearMatches (ctx, data) {

        // load states

        const userState = ctx.rootGetters['user/get']
        const homeState = ctx.getters.get


        // if is not inifinite scroll, it's mean a new fresh request

        if (!data.isInfiniteScroll) {

            // refresh states

            ctx.commit('resetStates')
        }

        const ownTeams = userState.teams.length
            ? userState.teams.map((team) => {
                return team.id
            })

            : null


        return new Promise((resolve, reject) => {

            this.$AWS.Amplify.configure(awsconfig.umt)

            this.$AWS.API.graphql(
                graphqlOperation(umt.queries.nearMatches, {
                    email           : userState.email,
                    geohash         : userState.geohash,
                    gender          : userState.gender,
                    age             : this.$UTILS.getAgeFromDate(userState.birthdate),
                    ageMinFilter    : userState.ageMinFilter,
                    ageMaxFilter    : userState.ageMaxFilter,
                    matchFilter     : userState.matchFilter,
                    nextToken       : homeState.nearMatchesNextToken,
                    ownTeams
                })
            )

                // success
                .then(async (result) => {

                    const nearMatchesResult = result.data.nearMatches

                    // format result

                    nearMatchesResult.items = nearMatchesResult.items.map((match) => {
                        return {
                            ...match,
                            patches     : JSON.parse(match.patches),
                            schedule    : match.schedule,
                            reqStat     : JSON.parse(match.reqStat),
                            coords      : JSON.parse(match.coords),
                            distance    : this.$UTILS.getDistance(
                                JSON.parse(match.coords).LAT.N,
                                JSON.parse(match.coords).LON.N,
                                userState.coords.LAT.N,
                                userState.coords.LON.N
                            )
                        }
                    })

                    // concat new matches loaded to state

                    const fullNearMatches = [
                        ...homeState.nearMatches,
                        ...nearMatchesResult.items
                    ]

                    // deduplicate matches (https://dev.to/marinamosti/removing-duplicates-in-an-array-of-objects-in-js-with-sets-3fep)

                    const nearMatches = fullNearMatches.reduce((acc, current) => {
                        const x = acc.find(item =>
                            `${item.teamId1}${item.teamId2}` ===
                            `${current.teamId1}${current.teamId2}`
                        )

                        if (!x) {
                            return acc.concat([current])
                        }

                        else {
                            return acc
                        }
                    }, [])


                    // fetch picture and name for each team of the match

                    for (const e in nearMatches) {

                        for (let i = 1; i <= 2; i++) {

                            await this.$AWS.API.graphql(
                                graphqlOperation(umt.queries.getTeam, {
                                    id: nearMatches[e][`teamId${i}`]
                                })
                            )
                                .then((result) => {
                                    nearMatches[e][`picture${i}`] = result.data.getTeam.picture
                                    nearMatches[e][`name${i}`] = result.data.getTeam.name
                                })


                                .catch((err) => {
                                    const response = { ...errorNotification, err }

                                    reject(response)
                                })
                        }
                    }

                    // nextToken

                    const nearMatchesNextToken = nearMatchesResult.nextToken


                    // save into store

                    const params = {
                        nearMatches,
                        nearMatchesNextToken
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
    },


    sendMatchRequest (ctx, data) {

        // load states

        const userState = ctx.rootGetters['user/get']
        const homeState = ctx.getters.get


        return new Promise((resolve, reject) => {

            this.$AWS.Amplify.configure(awsconfig.umt)

            this.$AWS.API.graphql(
                graphqlOperation(umt.mutations.addMatch, {
                    teamId1         : userState.primaryTeam.id,
                    teamId2         : data.id,
                    matchFilter     : userState.primaryTeam.matchFilter,
                    genderFilter    : userState.primaryTeam.genderFilter,
                    ageMinFilter    : userState.primaryTeam.ageMinFilter,
                    ageMaxFilter    : userState.primaryTeam.ageMaxFilter,
                    geohash         : userState.geohash,
                    latitude        : userState.coords.LAT.N,
                    longitude       : userState.coords.LON.N
                })
            )

                // success
                .then(() => {

                    const response = {
                        type    : 'success',
                        title   : '¡Solicitud enviada!',
                        msg     : 'La solicitud al equipo rival fue enviada.'
                    }

                    const params = {

                        // remove requested team from near teams list

                        nearTeams: homeState.nearTeams.filter(
                            team => team.id !== data.id
                        )
                    }

                    ctx.commit('setState', { params })

                    resolve(response)
                })


                // error
                .catch((err) => {
                    const response = { ...errorNotification, err }

                    reject(response)
                })
        })
    },


    sendMatchPatchRequest (ctx, data) {

        // load states

        const userState = ctx.rootGetters['user/get']
        const homeState = ctx.getters.get


        return new Promise((resolve, reject) => {

            this.$AWS.Amplify.configure(awsconfig.umt)

            this.$AWS.API.graphql(
                graphqlOperation(umt.mutations.addMatchPatch, {
                    teamId1     : data.teamId1,
                    teamId2     : data.teamId2,
                    email       : userState.email,
                    name        : userState.firstName,
                    expireOn    : data.expireOn,
                    reqStat     : JSON.stringify({
                        MR: { S: 'A' },
                        PR: { S: 'A' }
                    })
                })
            )

                // success
                .then(() => {

                    const response = {
                        type    : 'success',
                        title   : '¡Felicitaciones!',
                        msg     : `
                            Te has unido al match. Que disfrutes jugando con tus
                            compañeros de equipo.
                        `
                    }

                    const params = {

                        // remove requested match from near matches list

                        nearMatches: homeState.nearMatches.filter(match =>
                            `${match.teamId1}${match.teamId2}` !==
                            `${data.teamId1}${data.teamId2}`
                        )
                    }

                    ctx.commit('setState', { params })

                    resolve(response)
                })


                // error
                .catch((err) => {
                    const response = { ...errorNotification, err }

                    reject(response)
                })
        })
    },


    sendTeamMemberRequest (ctx, data) {

        // load states

        const userState = ctx.rootGetters['user/get']
        const homeState = ctx.getters.get


        return new Promise((resolve, reject) => {

            this.$AWS.Amplify.configure(awsconfig.umt)

            this.$AWS.API.graphql(
                graphqlOperation(umt.mutations.addTeamMember, {
                    teamId  : data.id,
                    email   : userState.email,
                    name    : userState.firstName,
                    role    : null,
                    reqStat : JSON.stringify({
                        TR: { S: 'P' },
                        PR: { S: 'A' }
                    })
                })
            )


                // success
                .then(() => {

                    const response = {
                        type    : 'success',
                        title   : '¡Solicitud enviada!',
                        msg     : 'La solicitud al equipo fue enviada.'
                    }

                    const params = {

                        // remove requested team from near teams list

                        nearTeamsForJoin: homeState.nearTeamsForJoin.filter(
                            team => team.id !== data.id
                        )
                    }

                    ctx.commit('setState', { params })

                    resolve(response)
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
    actions,
    state,
    getters,
    mutations
}
