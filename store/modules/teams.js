import { graphqlOperation } from '@aws-amplify/api'
import { umt } from '@/graphql/gql'
import errorNotification from '@/static/data/errorNotification.json'
import awsconfig from '~/aws-exports'


// functions

const getDefaultState = () => ({
    teamsChatMessages: []
})


// state

const state = getDefaultState()


// getters

const getters = {
    get (state) {
        return state
    }
}


// actions

const actions = {
    async listTeamChats (ctx, data) {
        this.$AWS.Amplify.configure(awsconfig.umt)


        // init state

        const userTeams = ctx.rootState.user.teams
        let teamsChatMessages = ctx.state.teamsChatMessages

        if (!teamsChatMessages.length) {
            teamsChatMessages = userTeams.map((team) => {
                return {
                    id: team.id,
                    messages: [],
                    nextToken: null
                }
            })
        }


        // fetch each team chat's messages

        for (const i in userTeams) {
            try {
                const result = await this.$AWS.API.graphql(
                    graphqlOperation(umt.queries.listTeamChats, {
                        id: userTeams[i].id,
                        nextToken: teamsChatMessages[i].nextToken
                    })
                )

                const data = result.data.listTeamChats.items

                teamsChatMessages[i].nextToken =
                    result.data.listTeamChats.nextToken

                if (data) {
                    data.map((teamChat) => {
                        teamsChatMessages[i].messages.push(teamChat)
                    })
                }

                const params = {
                    teamsChatMessages
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
