import { graphqlOperation } from '@aws-amplify/api'
import { umt } from '@/graphql/gql'
import errorNotification from '@/static/data/errorNotification.json'
import awsconfig from '~/aws-exports'


// get default state value

const getDefaultState = () => ({

    // array and object must be stringified to be reactive

    actives: JSON.stringify({
        teams   : [],
        user    : { matches: [], nextToken: null }
    }),

    requests: JSON.stringify({
        teams   : [],
        user    : { matches: [], nextToken: null }
    })

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

    async listMatches (ctx, data) {

        this.$AWS.Amplify.configure(awsconfig.umt)


        // init states

        const userState = ctx.rootGetters['user/get']
        const matchesState = ctx.getters.get

        const actives = matchesState.actives


        if (!actives.teams.length && userState.teams.length) {

            actives.teams = userState.teams.map((team) => {

                return {
                    teamId      : team.id,
                    matches     : [],
                    nextToken   : null
                }

            })

        }


        // fetch each team's actives matches

        for await (const team of actives.teams) {

            try {

                let result = await this.$AWS.API.graphql(
                    graphqlOperation(
                        umt.queries.listMatches,
                        {
                            id          : team.teamId,
                            nextToken   : team.nextToken
                        }
                    )
                )

                result = result.data.listMatches


                team.nextToken = result.nextToken


                // append data to state

                team.matches = [
                    ...team.matches,
                    ...result.items
                ]


                // deduplicate (https://dev.to/marinamosti/removing-duplicates-in-an-array-of-objects-in-js-with-sets-3fep)

                team.matches = team.matches.reduce((acc, current) => {

                    const x = acc.find(item => `${item.teamId1}${item.teamId2}` === `${current.teamId1}${current.teamId2}`)

                    if (!x) {
                        return acc.concat([current])
                    }

                    else {
                        return acc
                    }

                }, [])


                // fetc each match's messages

                for await (const match of team.matches) {

                    try {

                        // init match chat if not exist

                        if (!('chat' in match)) {

                            match.chat = {
                                messages    : [],
                                nextToken   : null
                            }

                        }


                        let result = await this.$AWS.API.graphql(
                            graphqlOperation(
                                umt.queries.listMatchChats,
                                {
                                    teamId1     : match.teamId1,
                                    teamId2     : match.teamId2,
                                    nextToken   : match.chat.nextToken
                                }
                            )
                        )

                        result = result.data.listMatchChats


                        match.chat.nextToken = result.nextToken


                        // append data to state

                        match.chat.messages = [
                            ...match.chat.messages,
                            ...result.items
                        ]


                        // deduplicate (https://dev.to/marinamosti/removing-duplicates-in-an-array-of-objects-in-js-with-sets-3fep)

                        match.chat.messages = match.chat.messages.reduce((acc, current) => {

                            const x = acc.find(item => `${item.sentOn}${item.email}` === `${current.sentOn}${current.email}`)

                            if (!x) {
                                return acc.concat([current])
                            }

                            else {
                                return acc
                            }

                        }, [])

                    }

                    catch (err) {

                        const response = { ...errorNotification, err }

                        throw response

                    }

                }

            }

            catch (err) {

                const response = { ...errorNotification, err }

                throw response

            }

        }

        const params = { actives }

        ctx.commit('setState', { params })

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
