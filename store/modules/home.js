import { graphqlOperation } from '@aws-amplify/api'
import { umt } from '@/graphql/gql'
import errorNotification from '@/static/data/errorNotification.json'
import awsconfig from '~/aws-exports'

const getLocalStorageState = (key) => {
    return JSON.parse(localStorage.getItem(key))
}

const getDefaultState = () => ({
    nearTeams: getLocalStorageState('nearTeams') || [],
    nearTeamsNextToken: getLocalStorageState('nearTeamsNextToken') || null,
    nearMatches: getLocalStorageState('nearMatches') || [],
    nearMatchesNextToken: getLocalStorageState('nearMatchesNextToken') || null
})

const state = getDefaultState()

const getters = {
    get (state) {
        return state
    }
}

const actions = {
    nearTeams (ctx, data) {
        const ownTeams = ctx.rootState.user.team
            ? ctx.rootState.user.teams.map((x) => {
                return x.id
            })
            : null

        const params = data.forJoin
            ? {
                ownTeams,
                geohash: ctx.rootState.user.geohash,
                forJoin: data.forJoin,
                gender: ctx.rootState.user.gender,
                genderFilter: [],
                ageMinFilter: ctx.rootState.user.ageMinFilter,
                ageMaxFilter: ctx.rootState.user.ageMaxFilter,
                matchFilter: ctx.rootState.user.matchFilter,
                nextToken: ctx.state.nearTeamsNextToken
            }
            : {
                ownTeams,
                geohash: ctx.rootState.user.primaryTeam.geohash,
                forJoin: data.forJoin,
                gender: ctx.rootState.user.gender,
                genderFilter: ctx.rootState.user.primaryTeam.genderFilter,
                ageMinFilter: ctx.rootState.user.primaryTeam.ageMinFilter,
                ageMaxFilter: ctx.rootState.user.primaryTeam.ageMaxFilter,
                matchFilter: ctx.rootState.user.primaryTeam.matchFilter,
                nextToken: ctx.state.nearTeamsNextToken
            }

        return new Promise((resolve, reject) => {
            this.$AWS.Amplify.configure(awsconfig.umt)
            this.$AWS.API.graphql(
                graphqlOperation(umt.queries.nearTeams, params)
            )
                .then((result) => {
                    const nearTeams = result.data.nearTeams.items.map((x) => {
                        return {
                            ...x,
                            formation: JSON.parse(x.formation),
                            coords: JSON.parse(x.coords),
                            distance: this.$UTILS.getDistance(
                                JSON.parse(x.coords).LAT.N,
                                JSON.parse(x.coords).LON.N,
                                ctx.rootState.user.coords.LAT.N,
                                ctx.rootState.user.coords.LON.N
                            )
                        }
                    })
                    const nearTeamsNextToken = result.data.nearTeams.nextToken

                    if (nearTeams) {
                        const params = {
                            nearTeams,
                            nearTeamsNextToken
                        }
                        ctx.commit('setState', { params })
                        resolve()
                    } else {
                        const params = {
                            nearTeams: [],
                            nearTeamsNextToken
                        }
                        ctx.commit('setState', { params })
                        resolve()
                    }
                })
                .catch((err) => {
                    const response = { ...errorNotification, err }
                    reject(response)
                })
        })
    },
    nearMatches (ctx, data) {
        const ownTeams = ctx.rootState.user.team
            ? ctx.rootState.user.teams.map((x) => {
                return x.id
            })
            : null

        return new Promise((resolve, reject) => {
            this.$AWS.Amplify.configure(awsconfig.umt)
            this.$AWS.API.graphql(
                graphqlOperation(umt.queries.nearMatches, {
                    geohash: ctx.rootState.user.geohash,
                    ownTeams,
                    gender: ctx.rootState.user.gender,
                    ageMinFilter: ctx.rootState.user.ageMinFilter,
                    ageMaxFilter: ctx.rootState.user.ageMaxFilter,
                    matchFilter: ctx.rootState.user.matchFilter,
                    nextToken: ctx.state.nearMatchesNextToken
                })
            )
                .then(async (result) => {
                    const nearMatches = result.data.nearMatches.items.map(
                        (x) => {
                            return {
                                ...x,
                                schedule: JSON.parse(x.schedule),
                                reqStat: JSON.parse(x.reqStat),
                                coords: JSON.parse(x.coords),
                                distance: this.$UTILS.getDistance(
                                    JSON.parse(x.coords).LAT.N,
                                    JSON.parse(x.coords).LON.N,
                                    ctx.rootState.user.coords.LAT.N,
                                    ctx.rootState.user.coords.LON.N
                                )
                            }
                        })
                    const nearMatchesNextToken =
                        result.data.nearMatches.nextToken

                    if (nearMatches) {
                        for (const e in nearMatches) {
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
                                            ...errorNotification, err
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
                    } else {
                        const params = {
                            nearMatches: [],
                            nearMatchesNextToken
                        }
                        ctx.commit('setState', { params })
                        resolve()
                    }
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
            localStorage.setItem(key, JSON.stringify(params[key]))
            state[key] = params[key]
        }
    }
}

export default {
    namespaced: true,
    actions,
    state,
    getters,
    mutations
}
