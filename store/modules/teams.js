import { graphqlOperation } from '@aws-amplify/api'
import { umt } from '@/graphql/gql'
import errorNotification from '@/static/data/errorNotification.json'
import awsconfig from '~/aws-exports'


// functions

const getDefaultState = () => ({

    // array and object must be stringified to be reactive

    teamsChatMessages: JSON.stringify([])
})


// state

const state = getDefaultState()


// getters

const getters = {
    get (state) {
        return {
            ...state,
            teamsChatMessages: JSON.parse(state.teamsChatMessages)
        }
    }
}


// actions

const actions = {
    async listTeamChats (ctx, data) {

        this.$AWS.Amplify.configure(awsconfig.umt)


        // validate that the user has teams

        const userTeams = ctx.rootGetters['user/get'].teams

        if (!userTeams) {
            return null
        }


        // init states

        let teamsChatMessages = JSON.parse(ctx.state.teamsChatMessages)

        if (!teamsChatMessages.length) {
            teamsChatMessages = userTeams.map((team) => {
                return {
                    id          : team.id,
                    messages    : [],
                    nextToken   : null
                }
            })
        }


        // fetch each team chat's messages

        for (const i in userTeams) {

            try {
                const result = await this.$AWS.API.graphql(
                    graphqlOperation(
                        umt.queries.listTeamChats,
                        {
                            id          : userTeams[i].id,
                            nextToken   : teamsChatMessages[i].nextToken
                        }
                    )
                )

                const data = result.data.listTeamChats.items
                teamsChatMessages[i].nextToken = result.data.listTeamChats.nextToken


                // add data

                if (data) {
                    data.map((teamChat) => {
                        teamsChatMessages[i].messages.push(teamChat)
                    })
                }


                const params = {
                    teamsChatMessages: JSON.stringify(teamsChatMessages)
                }

                ctx.commit('setState', { params })
            }

            catch (err) {
                const response = {
                    ...errorNotification,
                    err
                }

                throw response
            }
        }
    },


    createTeam (ctx, data) {

        const userState = ctx.rootGetters['user/get']

        return new Promise((resolve, reject) => {

            this.$AWS.Amplify.configure(awsconfig.umt)


            // init params

            let params = {
                name            : data.name,
                geohash         : userState.geohash,
                latitude        : userState.coords.LAT.N,
                longitude       : userState.coords.LON.N,
                picture         : data.picture,
                genderFilter    : [userState.gender],
                ageMinFilter    : userState.ageMinFilter,
                ageMaxFilter    : userState.ageMaxFilter,
                matchFilter     : userState.matchFilter
            }

            this.$AWS.API.graphql(
                graphqlOperation(umt.mutations.addTeam, params)
            )
                .then((result) => {

                    const userTeams = userState.teams ? [...userState.teams] : []


                    // set teams in user store

                    userTeams.push(
                        {
                            id              : result.data.addTeam.id,
                            name            : result.data.addTeam.name,
                            picture         : result.data.addTeam.picture,
                            formation       : JSON.parse(result.data.addTeam.formation),
                            geohash         : result.data.addTeam.geohash,
                            coords          : JSON.parse(result.data.addTeam.coords),
                            genderFilter    : result.data.addTeam.genderFilter,
                            ageMinFilter    : result.data.addTeam.ageMinFilter,
                            ageMaxFilter    : result.data.addTeam.ageMaxFilter,
                            matchFilter     : result.data.addTeam.matchFilter
                        }
                    )

                    params = { teams: JSON.stringify(userTeams) }

                    ctx.commit('user/setState', { params }, { root: true })


                    // set primary team only if its the first team added

                    if (userTeams.length === 1) {

                        params = { primaryTeam: JSON.stringify(userTeams[0]) }

                        ctx.commit('user/setState', { params }, { root: true })
                    }

                    const response = {
                        type: 'success',
                        title: '¡Equipo creado!',
                        msg: 'El equipo fue creado exitosamente.'
                    }

                    resolve(response)
                })
                .catch((err) => {
                    let response = { ...errorNotification, err }

                    try {

                        const error = JSON.parse(err.errors[0].message)

                        switch (error.code) {

                        // team already exists

                        case 'TeamExistException': {
                            response = {
                                type: 'error',
                                title: '¡El equipo ya existe!',
                                msg: error.message,
                                err
                            }

                            break
                        }

                        // unknown error

                        default:
                            break
                        }

                        reject(response)
                    }

                    catch (e) {
                        reject(response)
                    }
                })
        })
    }
}


// mutations

const mutations = {
    setState (state, { params }) {
        for (const key in params) {
            state[key] = params[key]
        }
    }
}


// export

export default {
    namespaced: true,
    actions,
    state,
    getters,
    mutations
}
