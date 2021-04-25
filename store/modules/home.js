import { graphqlOperation } from '@aws-amplify/api'
import { umt } from '@/graphql/gql'
import errorNotification from '@/static/data/errorNotification.json'
import awsconfig from '~/aws-exports'

const getDefaultState = () => ({
    nearTeams: [],
    nearTeamsNextToken: null,
    nearTeamsForJoin: [],
    nearTeamsForJoinNextToken: null,
    nearMatches: [],
    nearMatchesNextToken: null
})

const state = getDefaultState()

const getters = {
    get (state) {
        return state
    }
}

const actions = {
    nearTeams (ctx, data) {
        if (!data.isInfiniteScroll) {
            ctx.commit('resetStates')
        }

        const ownTeams = ctx.rootState.user.teams
            ? ctx.rootState.user.teams.map((team) => {
                return team.id
            })
            : null

        let params = {
            ownTeams,
            email: ctx.rootState.user.email,
            forJoin: data.forJoin,
            gender: ctx.rootState.user.gender,
            age: this.$UTILS.getAgeFromDate(ctx.rootState.user.birthdate)
        }

        params = data.forJoin
            ? {
                ...params,
                geohash: ctx.rootState.user.geohash,
                genderFilter: [],
                ageMinFilter: ctx.rootState.user.ageMinFilter,
                ageMaxFilter: ctx.rootState.user.ageMaxFilter,
                matchFilter: ctx.rootState.user.matchFilter,
                nextToken: ctx.state.nearTeamsForJoinNextToken
            }
            : {
                ...params,
                geohash: ctx.rootState.user.primaryTeam.geohash,
                genderFilter: ctx.rootState.user.primaryTeam.genderFilter,
                ageMinFilter: ctx.rootState.user.primaryTeam.ageMinFilter,
                ageMaxFilter: ctx.rootState.user.primaryTeam.ageMaxFilter,
                matchFilter: ctx.rootState.user.primaryTeam.matchFilter,
                nextToken: ctx.state.nearTeamsNextToken
            }

        return new Promise((resolve, reject) => {
            // There are no more items to show
            if (
                !ctx.state.nearTeamsNextToken &&
                ctx.state.nearTeams.length &&
                !data.forJoin
            ) {
                resolve()
            }
            // There are no more items to show (forJoin)
            else if (
                !ctx.state.nearTeamsForJoinNextToken &&
                ctx.state.nearTeamsForJoin.length
            ) {
                resolve()
            }
            else {
                this.$AWS.Amplify.configure(awsconfig.umt)

                this.$AWS.API.graphql(
                    graphqlOperation(umt.queries.nearTeams, params)
                )
                    .then((result) => {
                        const stateNearTeams = data.forJoin
                            ? ctx.state.nearTeamsForJoin
                            : ctx.state.nearTeams

                        const nearTeams = stateNearTeams.concat(
                            result.data.nearTeams.items.map((team) => {
                                return {
                                    ...team,
                                    formation: JSON.parse(team.formation),
                                    coords: JSON.parse(team.coords),
                                    distance: this.$UTILS.getDistance(
                                        JSON.parse(team.coords).LAT.N,
                                        JSON.parse(team.coords).LON.N,
                                        ctx.rootState.user.coords.LAT.N,
                                        ctx.rootState.user.coords.LON.N
                                    )
                                }
                            })
                        )

                        const nextToken = result.data.nearTeams.nextToken

                        const params = data.forJoin
                            ? {
                                nearTeamsForJoin: nearTeams,
                                nearTeamsForJoinNextToken: nextToken
                            }
                            : {
                                nearTeams,
                                nearTeamsNextToken: nextToken
                            }

                        ctx.commit('setState', { params })
                        resolve()
                    })
                    .catch((err) => {
                        const response = { ...errorNotification, err }
                        reject(response)
                    })
            }
        })
    },

    nearMatches (ctx, data) {
        if (!data.isInfiniteScroll) {
            ctx.commit('resetStates')
        }

        const ownTeams = ctx.rootState.user.teams
            ? ctx.rootState.user.teams.map((team) => {
                return team.id
            })
            : null

        return new Promise((resolve, reject) => {
            if (!ctx.state.nearMatchesNextToken && ctx.state.nearMatches.length) {
                resolve()
            }
            else {
                this.$AWS.Amplify.configure(awsconfig.umt)
                this.$AWS.API.graphql(
                    graphqlOperation(umt.queries.nearMatches, {
                        email: ctx.rootState.user.email,
                        geohash: ctx.rootState.user.geohash,
                        ownTeams,
                        gender: ctx.rootState.user.gender,
                        age: this.$UTILS.getAgeFromDate(
                            ctx.rootState.user.birthdate
                        ),
                        ageMinFilter: ctx.rootState.user.ageMinFilter,
                        ageMaxFilter: ctx.rootState.user.ageMaxFilter,
                        matchFilter: ctx.rootState.user.matchFilter,
                        nextToken: ctx.state.nearMatchesNextToken
                    })
                )
                    .then(async (result) => {
                        const nearMatches = result.data.nearMatches.items.map(
                            (match) => {
                                return {
                                    ...match,
                                    patches: JSON.parse(match.patches),
                                    schedule: this.$UTILS.getLocalFromUTC(
                                        match.schedule
                                    ),
                                    reqStat: JSON.parse(match.reqStat),
                                    coords: JSON.parse(match.coords),
                                    distance: this.$UTILS.getDistance(
                                        JSON.parse(match.coords).LAT.N,
                                        JSON.parse(match.coords).LON.N,
                                        ctx.rootState.user.coords.LAT.N,
                                        ctx.rootState.user.coords.LON.N
                                    )
                                }
                            }
                        )

                        const nearMatchesNextToken =
                            result.data.nearMatches.nextToken

                        for (const e in nearMatches) {
                            // Fetch each team information
                            for (let i = 1; i <= 2; i++) {
                                await this.$AWS.API.graphql(
                                    graphqlOperation(umt.queries.getTeam, {
                                        id: nearMatches[e][`teamId${i}`]
                                    })
                                )
                                    .then((result) => {
                                        nearMatches[e][`picture${i}`] =
                                            result.data.getTeam.picture

                                        nearMatches[e][`name${i}`] =
                                            result.data.getTeam.name
                                    })
                                    .catch((err) => {
                                        const response = {
                                            ...errorNotification,
                                            err
                                        }
                                        reject(response)
                                    })
                            }
                        }

                        const params = {
                            nearMatches,
                            nearMatchesNextToken
                        }

                        ctx.commit('setState', { params })
                        resolve()
                    })
                    .catch((err) => {
                        const response = { ...errorNotification, err }
                        reject(response)
                    })
            }
        })
    },

    sendMatchRequest (ctx, data) {
        return new Promise((resolve, reject) => {
            this.$AWS.Amplify.configure(awsconfig.umt)
            this.$AWS.API.graphql(
                graphqlOperation(umt.mutations.addMatch, {
                    teamId1: ctx.rootState.user.primaryTeam.id,
                    teamId2: data.id,
                    matchFilter: ctx.rootState.user.primaryTeam.matchFilter,
                    genderFilter: ctx.rootState.user.primaryTeam.genderFilter,
                    ageMinFilter: ctx.rootState.user.primaryTeam.ageMinFilter,
                    ageMaxFilter: ctx.rootState.user.primaryTeam.ageMaxFilter,
                    geohash: ctx.rootState.user.geohash,
                    latitude: ctx.rootState.user.coords.LAT.N,
                    longitude: ctx.rootState.user.coords.LON.N
                })
            )
                .then(() => {
                    const response = {
                        type: 'success',
                        title: '¡Solicitud enviada!',
                        msg: `
                            La solicitud al equipo rival fue enviada.
                        `
                    }

                    const params = {
                        nearTeams: ctx.state.nearTeams.filter(
                            team => team.id !== data.id
                        )
                    }
                    ctx.commit('setState', { params })

                    resolve(response)
                })
                .catch((err) => {
                    const response = { ...errorNotification, err }
                    reject(response)
                })
        })
    },

    sendMatchPatchRequest (ctx, data) {
        return new Promise((resolve, reject) => {
            this.$AWS.Amplify.configure(awsconfig.umt)
            this.$AWS.API.graphql(
                graphqlOperation(umt.mutations.addMatchPatch, {
                    teamId1: data.teamId1,
                    teamId2: data.teamId2,
                    email: ctx.rootState.user.email,
                    expireOn: data.expireOn,
                    reqStat: JSON.stringify({
                        MR: { S: 'A' },
                        PR: { S: 'A' }
                    })
                })
            )
                .then(() => {
                    const response = {
                        type: 'success',
                        title: '¡Felicitaciones!',
                        msg: `
                            Te has unido al match. Que disfrutes jugando con tus
                            compañeros de equipo.
                        `
                    }

                    const params = {
                        nearMatches: ctx.state.nearMatches.filter(
                            match =>
                                `${match.teamId1}${match.teamId2}` !==
                                `${data.teamId1}${data.teamId2}`
                        )
                    }
                    ctx.commit('setState', { params })

                    resolve(response)
                })
                .catch((err) => {
                    const response = { ...errorNotification, err }
                    reject(response)
                })
        })
    },

    sendTeamMemberRequest (ctx, data) {
        return new Promise((resolve, reject) => {
            this.$AWS.Amplify.configure(awsconfig.umt)
            this.$AWS.API.graphql(
                graphqlOperation(umt.mutations.addTeamMember, {
                    teamId: data.id,
                    email: ctx.rootState.user.email,
                    role: null,
                    reqStat: JSON.stringify({
                        TR: { S: 'P' },
                        PR: { S: 'A' }
                    })
                })
            )
                .then(() => {
                    const response = {
                        type: 'success',
                        title: '¡Solicitud enviada!',
                        msg: `
                            La solicitud al equipo fue enviada.
                        `
                    }

                    const params = {
                        nearTeams: ctx.state.nearTeams.filter(
                            team => team.id !== data.id
                        )
                    }
                    ctx.commit('setState', { params })

                    resolve(response)
                })
                .catch((err) => {
                    const response = { ...errorNotification, err }
                    reject(response)
                })
        })
    }
}

const mutations = {
    setState (state, { params }) {
        for (const key in params) {
            state[key] = params[key]
        }
    },

    resetStates (state) {
        Object.assign(state, getDefaultState())
    }
}

export default {
    namespaced: true,
    actions,
    state,
    getters,
    mutations
}
