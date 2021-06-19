import { graphqlOperation } from '@aws-amplify/api'
import { arv, umt } from '@/graphql/gql'
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

const fetchMessages = async (ctx, match) => {

    try {

        // init match chat if not exist

        if (!('chat' in match)) {

            match.chat = {
                messages    : [],
                nextToken   : null
            }

        }


        let result = await ctx.$AWS.API.graphql(
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


// fetch team info

const fetchTeamInfo = async (ctx, id) => {

    try {

        let result = await ctx.$AWS.API.graphql(
            graphqlOperation(
                umt.queries.getTeam,
                {
                    id
                }
            )
        )

        result = result.data.getTeam

        return { name: result.name, picture: result.picture }

    }

    catch (err) {

        const response = { ...errorNotification, err }

        throw response

    }

}


// set teams info into the match

const setTeamsInfo = async (ctx, match) => {

    const teamInfo1 = await fetchTeamInfo(ctx, match.teamId1)
    const teamInfo2 = await fetchTeamInfo(ctx, match.teamId2)

    match.name1 = teamInfo1.name
    match.picture1 = teamInfo1.picture

    match.name2 = teamInfo2.name
    match.picture2 = teamInfo2.picture

}


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

        for (const team of actives.teams) {

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

                    // convert into object some elements

                    team.matches = [
                        ...team.matches,
                        ...result.items.map((x) => {
                            return {
                                ...x,
                                coords  : JSON.parse(x.coords),
                                patches : JSON.parse(x.patches),
                                reqStat : JSON.parse(x.reqStat),
                                members : {
                                    players     : [],
                                    nextToken   : null
                                }
                            }
                        })
                    ]

                }


                // deduplicate

                team.matches = team.matches.reduce((acc, current) => {

                    return deduplicate(acc, current, 'teamId1', 'teamId2')

                }, [])


                // fetch each match's messages and opponent info

                for (const match of team.matches) {

                    await fetchMessages(this, match)
                    await setTeamsInfo(this, match)

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

                // convert into object some elements

                actives.user.matches = [
                    ...actives.user.matches,
                    ...result.items.map((x) => {
                        return {
                            ...x,
                            coords  : JSON.parse(x.coords),
                            patches : JSON.parse(x.patches),
                            reqStat : JSON.parse(x.reqStat),
                            members : {
                                players     : [],
                                nextToken   : null
                            }
                        }
                    })
                ]

            }


            // deduplicate

            actives.user.matches = actives.user.matches.reduce((acc, current) => {

                return deduplicate(acc, current, 'teamId1', 'teamId2')

            }, [])


            // fetch each match's messages and teams info

            for (const match of actives.user.matches) {

                await fetchMessages(this, match)
                await setTeamsInfo(this, match)

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

        for (const team of requests.teams) {

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
                        ...result.items.map((x) => {
                            return {
                                ...x,
                                coords  : JSON.parse(x.coords),
                                patches : JSON.parse(x.patches),
                                reqStat : JSON.parse(x.reqStat)
                            }
                        })
                    ]

                }


                // deduplicate

                team.matches = team.matches.reduce((acc, current) => {

                    return deduplicate(acc, current, 'teamId1', 'teamId2')

                }, [])


                // fetch each match's opponent info

                for (const match of team.matches) {

                    await setTeamsInfo(this, match)

                }

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
                    ...result.items.map((x) => {
                        return {
                            ...x,
                            reqStat : JSON.parse(x.reqStat)
                        }
                    })
                ]

            }


            // deduplicate

            requests.user.matches = requests.user.matches.reduce((acc, current) => {

                return deduplicate(acc, current, 'teamId1', 'teamId2')

            }, [])


            // fetch each match's teams info

            for (const match of requests.user.matches) {

                await setTeamsInfo(this, match)

            }

        }

        catch (err) {

            const response = { ...errorNotification, err }

            throw response

        }


        const params = { requests }

        ctx.commit('setState', { params })

    },


    updateMatch (ctx, data) {

        const matchesState = ctx.getters.get

        return new Promise((resolve, reject) => {

            this.$AWS.Amplify.configure(awsconfig.umt)

            this.$AWS.API.graphql(
                graphqlOperation(umt.mutations.updateMatch, {
                    ...data,
                    coords  : JSON.stringify(data.coords),
                    patches : JSON.stringify(data.patches),
                    reqStat : JSON.stringify(data.reqStat)
                })
            )


                // success
                .then(() => {

                    // build response message

                    if (data.action === 'reject') {

                        const response = {
                            type    : 'success',
                            title   : '¡Solicitud cancelada!',
                            msg     : 'La solicitud ha sido cancelada.'
                        }


                        // remove request from requests

                        for (const team of matchesState.requests.teams) {

                            team.matches = team.matches.filter(
                                match => `${match.teamId1}${match.teamId2}` !== `${data.teamId1}${data.teamId2}`
                            )

                        }


                        // update store

                        const params = {
                            requests: matchesState.requests
                        }

                        ctx.commit('setState', { params })


                        resolve(response)

                    }

                    else {

                        const response = {
                            type    : 'success',
                            title   : '¡Solicitud aceptada!',
                            msg     : 'La solicitud ha sido aceptada.'
                        }


                        // remove request from requests

                        for (const team of matchesState.requests.teams) {

                            team.matches = team.matches.filter(
                                match => `${match.teamId1}${match.teamId2}` !== `${data.teamId1}${data.teamId2}`
                            )

                        }


                        // add request to actives

                        for (const team of matchesState.actives.teams) {

                            team.matches = [
                                ...team.matches,
                                {
                                    ...data,
                                    chat: {
                                        messages    : [],
                                        nextToken   : null
                                    },
                                    members: {
                                        players     : [],
                                        nextToken   : null
                                    }
                                }
                            ]

                        }


                        // update store

                        const params = {
                            requests    : matchesState.requests,
                            actives     : matchesState.actives
                        }

                        ctx.commit('setState', { params })


                        resolve(response)

                    }

                })


                // error
                .catch((err) => {

                    const response = { ...errorNotification, err }

                    reject(response)

                })
        })
    },


    updateMatchPatch (ctx, data) {

        const matchesState = ctx.getters.get

        return new Promise((resolve, reject) => {

            this.$AWS.Amplify.configure(awsconfig.umt)

            this.$AWS.API.graphql(
                graphqlOperation(umt.mutations.updateMatchPatch, {
                    ...data,
                    reqStat : JSON.stringify(data.reqStat)
                })
            )


                // success
                .then(async () => {

                    // build response message

                    if (data.action === 'reject') {

                        const response = {
                            type    : 'success',
                            title   : '¡Solicitud cancelada!',
                            msg     : 'La solicitud ha sido cancelada.'
                        }


                        // remove request from requests

                        matchesState.requests.user.matches = matchesState.requests.user.matches.filter(
                            match => `${match.teamId1}${match.teamId2}` !== `${data.teamId1}${data.teamId2}`
                        )


                        // update store

                        const params = {
                            requests: matchesState.requests
                        }

                        ctx.commit('setState', { params })


                        resolve(response)

                    }

                    else {

                        const response = {
                            type    : 'success',
                            title   : '¡Solicitud aceptada!',
                            msg     : 'La solicitud ha sido aceptada.'
                        }


                        // remove request from requests

                        matchesState.requests.user.matches = matchesState.requests.user.matches.filter(
                            match => `${match.teamId1}${match.teamId2}` !== `${data.teamId1}${data.teamId2}`
                        )


                        // fetch match's info to add to actives later

                        try {

                            let result = await this.$AWS.API.graphql(
                                graphqlOperation(
                                    umt.queries.getMatch,
                                    {
                                        teamId1: data.teamId1,
                                        teamId2: data.teamId2
                                    }
                                )
                            )

                            result = result.data.getMatch


                            // append data to actives

                            if (result) {

                                matchesState.actives.user.matches = [
                                    ...matchesState.actives.user.matches,
                                    {
                                        ...result,
                                        coords  : JSON.parse(result.coords),
                                        patches : JSON.parse(result.patches),
                                        reqStat : JSON.parse(result.reqStat),
                                        chat    : {
                                            messages    : [],
                                            nextToken   : null
                                        }
                                    }
                                ]

                            }


                            // fetch each match's teams info

                            for (const match of matchesState.actives.user.matches) {

                                await setTeamsInfo(this, match)

                            }

                        }

                        catch (err) {

                            const response = { ...errorNotification, err }

                            throw response

                        }


                        // update store

                        const params = {
                            requests    : matchesState.requests,
                            actives     : matchesState.actives
                        }

                        ctx.commit('setState', { params })


                        resolve(response)

                    }

                })


                // error
                .catch((err) => {

                    const response = { ...errorNotification, err }

                    reject(response)

                })
        })
    },


    sendMessage (ctx, data) {

        // load states

        const matchesState = ctx.getters.get
        const userState = ctx.rootGetters['user/get']


        // append message to chat for team matches

        matchesState.actives.teams = matchesState.actives.teams.map((team) => {

            if (team.teamId === data.teamId1 || team.teamId === data.teamId2) {

                team.matches = team.matches.map((match) => {

                    if (match.teamId1 === data.teamId1 && match.teamId2 === data.teamId2) {

                        match.chat.messages.unshift({
                            teamId1 : data.teamId1,
                            teamId2 : data.teamId2,
                            email   : userState.email,
                            sentOn  : new Date().toISOString(),
                            author  : userState.firstName,
                            msg     : data.msg
                        })

                    }

                    return match

                })

            }

            return team

        })


        // append message to chat for user matches

        matchesState.actives.user.matches = matchesState.actives.user.matches.map((match) => {

            if (match.teamId1 === data.teamId1 && match.teamId2 === data.teamId2) {

                match.chat.messages.unshift({
                    teamId1 : data.teamId1,
                    teamId2 : data.teamId2,
                    email   : userState.email,
                    sentOn  : new Date().toISOString(),
                    author  : userState.firstName,
                    msg     : data.msg
                })

            }

            return match

        })


        // update store

        const params = {
            actives: matchesState.actives
        }

        ctx.commit('setState', { params })


        // save into dynamoDB

        return new Promise((resolve, reject) => {

            this.$AWS.Amplify.configure(awsconfig.umt)

            this.$AWS.API.graphql(
                graphqlOperation(umt.mutations.addMatchChat, {
                    teamId1 : data.teamId1,
                    teamId2 : data.teamId2,
                    email   : userState.email,
                    author  : userState.firstName,
                    msg     : data.msg,
                    expireOn: data.expireOn
                })
            )


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
    },


    async fetchMembers (ctx, data) {

        const matchesState = ctx.getters.get


        // fetch each user's requests

        this.$AWS.Amplify.configure(awsconfig.umt)

        try {

            // team 1 members

            let result1 = await this.$AWS.API.graphql(
                graphqlOperation(
                    umt.queries.listTeamMembers,
                    {
                        teamId      : data.teamId1,
                        nextToken   : null // this always should be null
                    }
                )
            )

            result1 = result1.data.listTeamMembers.items || []

            // team 1 members

            let result2 = await this.$AWS.API.graphql(
                graphqlOperation(
                    umt.queries.listTeamMembers,
                    {
                        teamId      : data.teamId2,
                        nextToken   : null // this always should be null
                    }
                )
            )

            result2 = result2.data.listTeamMembers.items || []

            // match patches

            let result3 = await this.$AWS.API.graphql(
                graphqlOperation(
                    umt.queries.listMatchPatches,
                    {
                        teamId1     : data.teamId1,
                        teamId2     : data.teamId2,
                        nextToken   : null // this always should be null
                    }
                )
            )

            result3 = result3.data.listMatchPatches.items || []


            const result = [...result1, ...result2, ...result3]


            // fetch picture of each player

            this.$AWS.Amplify.configure(awsconfig.arv)

            for (const player of result) {

                const result4 = await this.$AWS.API.graphql(
                    graphqlOperation(
                        arv.queries.getUser,
                        {
                            email: player.email
                        }
                    )
                )

                player.picture = result4.data.getUser.picture

            }


            // append data for team matches

            matchesState.actives.teams = matchesState.actives.teams.map((team) => {

                if (team.teamId === data.teamId1 || team.teamId === data.teamId2) {

                    team.matches = team.matches.map((match) => {

                        if (match.teamId1 === data.teamId1 && match.teamId2 === data.teamId2) {

                            match.members.players = result

                        }

                        return match

                    })

                }

                return team

            })


            // append message to chat for user matches

            matchesState.actives.user.matches = matchesState.actives.user.matches.map((match) => {

                if (match.teamId1 === data.teamId1 && match.teamId2 === data.teamId2) {

                    match.members.players = result

                }

                return match

            })


            // update store

            const params = {
                actives: matchesState.actives
            }

            ctx.commit('setState', { params })

        }

        catch (err) {

            const response = { ...errorNotification, err }

            throw response

        }

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
