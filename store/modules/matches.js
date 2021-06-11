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


        // deduplicate results from api by keys
        // ref: https://dev.to/marinamosti/removing-duplicates-in-an-array-of-objects-in-js-with-sets-3fep

        const deduplicate = (acc, current, key1, key2) => {

            const x = acc.find(item => `${item[key1]}${item[key2]}` === `${current[key1]}${current[key2]}`)

            if (!x) {
                return acc.concat([current])
            }

            else {
                return acc
            }

        }


        // fetch messages from a match's chat

        const fetchMessages = async (match) => {

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

                if (result.items) {

                    match.chat.messages = [
                        ...match.chat.messages,
                        ...result.items
                    ]

                }


                // deduplicate

                match.chat.messages = match.chat.messages.reduce((acc, current) => {

                    return deduplicate(acc, current, 'sentOn', 'email')

                }, [])

            }

            catch (err) {

                const response = { ...errorNotification, err }

                throw response

            }

        }


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

                if (result.items) {

                    team.matches = [
                        ...team.matches,
                        ...result.items
                    ]

                }


                // deduplicate

                team.matches = team.matches.reduce((acc, current) => {

                    return deduplicate(acc, current, 'teamId1', 'teamId2')

                }, [])


                // fetc each match's messages

                for await (const match of team.matches) {

                    fetchMessages(match)

                }

            }

            catch (err) {

                const response = { ...errorNotification, err }

                throw response

            }

        }


        // fetch each user's actives matches

        try {

            let result = await this.$AWS.API.graphql(
                graphqlOperation(
                    umt.queries.listMatches,
                    {
                        email       : userState.email,
                        nextToken   : actives.user.nextToken
                    }
                )
            )

            result = result.data.listMatches


            actives.user.nextToken = result.nextToken


            // append data to state

            if (result.items) {

                actives.user.matches = [
                    ...actives.user.matches,
                    ...result.items
                ]

            }


            // deduplicate

            actives.user.matches = actives.user.matches.reduce((acc, current) => {

                return deduplicate(acc, current, 'teamId1', 'teamId2')

            }, [])


            // fetc each match's messages

            for await (const match of actives.user.matches) {

                fetchMessages(match)

            }

        }

        catch (err) {

            const response = { ...errorNotification, err }

            throw response

        }


        const params = { actives }

        ctx.commit('setState', { params })

    },


    async listRequests (ctx, data) {


        // deduplicate results from api by keys
        // ref: https://dev.to/marinamosti/removing-duplicates-in-an-array-of-objects-in-js-with-sets-3fep

        const deduplicate = (acc, current, key1, key2) => {

            const x = acc.find(item => `${item[key1]}${item[key2]}` === `${current[key1]}${current[key2]}`)

            if (!x) {
                return acc.concat([current])
            }

            else {
                return acc
            }

        }


        this.$AWS.Amplify.configure(awsconfig.umt)


        // init states

        const userState = ctx.rootGetters['user/get']
        const matchesState = ctx.getters.get

        const requests = matchesState.requests


        if (!requests.teams.length && userState.teams.length) {

            requests.teams = userState.teams.map((team) => {

                return {
                    teamId      : team.id,
                    matches     : [],
                    nextToken   : null
                }

            })

        }


        // fetch each team's requests

        for await (const team of requests.teams) {

            try {

                let result = await this.$AWS.API.graphql(
                    graphqlOperation(
                        umt.queries.matchRequests,
                        {
                            id          : team.teamId,
                            nextToken   : team.nextToken
                        }
                    )
                )

                result = result.data.matchRequests


                team.nextToken = result.nextToken


                // append data to state

                if (result.items) {

                    team.matches = [
                        ...team.matches,
                        ...result.items
                    ]

                }


                // deduplicate

                team.matches = team.matches.reduce((acc, current) => {

                    return deduplicate(acc, current, 'teamId1', 'teamId2')

                }, [])

            }

            catch (err) {

                const response = { ...errorNotification, err }

                throw response

            }

        }


        // fetch each user's requests

        try {

            let result = await this.$AWS.API.graphql(
                graphqlOperation(
                    umt.queries.matchPatchRequests,
                    {
                        email       : userState.email,
                        nextToken   : requests.user.nextToken
                    }
                )
            )

            result = result.data.matchPatchRequests


            requests.user.nextToken = result.nextToken


            // append data to state

            if (result.items) {

                requests.user.matches = [
                    ...requests.user.matches,
                    ...result.items
                ]

            }


            // deduplicate

            requests.user.matches = requests.user.matches.reduce((acc, current) => {

                return deduplicate(acc, current, 'teamId1', 'teamId2')

            }, [])

        }

        catch (err) {

            const response = { ...errorNotification, err }

            throw response

        }


        const params = { requests }

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
