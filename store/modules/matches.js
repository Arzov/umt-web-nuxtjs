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
        user    : { requests: [], nextToken: null }
    })

})


// check if an object is included in an array

const objectInArray = (obj, array, keys) => {

    const filteredObj = Object.keys(obj)
        .filter(key => keys.includes(key))
        .reduce((o, key) => {
            o[key] = obj[key]
            return o
        }, {})

    for (const e of array) {

        const filteredE = Object.keys(e)
            .filter(key => keys.includes(key))
            .reduce((o, key) => {
                o[key] = e[key]
                return o
            }, {})

        if (JSON.stringify(filteredE) === JSON.stringify(filteredObj)) {
            return true
        }

    }

    return false

}


// fetch messages from a match's chat

const fetchMessages = async (ctx, match) => {

    try {

        // init match chat if not exist

        if (!('chat' in match)) {
            match.chat = { messages: [], nextToken: null }
        }


        let result = await ctx.$AWS.API.graphql(graphqlOperation(
            umt.queries.listMatchChats,
            {
                teamId1     : match.teamId1,
                teamId2     : match.teamId2,
                nextToken   : match.chat.nextToken
            }
        ))

        result = result.data.listMatchChats
        match.chat.nextToken = result.nextToken


        // append data to state

        if (result.items) {

            // check if new messages exist in current loaded messages.
            // if yes, it means that we scan all dynamodb data. So, we
            // don't should append it to avoid duplicates.

            let exist = false

            if (match.chat.messages.length) {

                const check = result.items[0]

                exist = objectInArray(check, match.chat.messages, ['email', 'sentOn', 'msg'])

            }

            if (!exist) {

                match.chat.messages = [
                    ...match.chat.messages,
                    ...result.items
                ]

            }

        }

    }

    catch (err) {
        const response = { ...errorNotification, err }
        throw response
    }

}


// fetch team info

const fetchTeamInfo = async (ctx, id) => {

    try {

        let result = await ctx.$AWS.API.graphql(graphqlOperation(
            umt.queries.getTeam,
            {
                id
            }
        ))

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

    async listActives (ctx, data) {

        this.$AWS.Amplify.configure(awsconfig.umt)


        // init states

        const userState = ctx.rootGetters['user/get']
        const matchesState = ctx.getters.get

        const actives = matchesState.actives


        if (!actives.teams.length && userState.teams.length) {

            actives.teams = userState.teams.map((team) => {

                return {
                    ...team,
                    matches: { matches: [], nextToken: null }
                }

            })

        }


        // fetch each team's actives matches

        for (const team of actives.teams) {

            try {

                let result = await this.$AWS.API.graphql(graphqlOperation(
                    umt.queries.listMatches,
                    {
                        id          : team.id,
                        nextToken   : team.nextToken
                    }
                ))

                result = result.data.listMatches
                team.matches.nextToken = result.nextToken


                // append data to state

                if (result.items) {

                    // check if new matches exist in current loaded matches.
                    // if yes, it means that we scan all dynamodb data. So, we
                    // don't should append it to avoid duplicates.

                    let exist = false

                    if (team.matches.matches.length) {

                        const check = result.items[0]

                        exist = objectInArray(check, team.matches.matches, ['teamId1', 'teamId2'])

                    }

                    if (!exist) {

                        team.matches.matches = [
                            ...team.matches.matches,
                            ...result.items.map((x) => {
                                return {
                                    ...x,
                                    coords  : JSON.parse(x.coords),
                                    patches : JSON.parse(x.patches),
                                    reqStat : JSON.parse(x.reqStat),
                                    members : {
                                        members     : [],
                                        nextToken1  : null,
                                        nextToken2  : null,
                                        nextToken   : null
                                    }
                                }
                            })
                        ]

                    }

                }


                // fetch each match's messages and opponent info

                for (const match of team.matches.matches) {

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

            let result = await this.$AWS.API.graphql(graphqlOperation(
                umt.queries.listMatches,
                {
                    email       : userState.email,
                    nextToken   : actives.user.nextToken
                }
            ))

            result = result.data.listMatches
            actives.user.nextToken = result.nextToken


            // append data to state

            if (result.items) {

                // check if new matches exist in current loaded matches.
                // if yes, it means that we scan all dynamodb data. So, we
                // don't should append it to avoid duplicates.

                let exist = false

                if (actives.user.matches.length) {

                    const check = result.items[0]

                    exist = objectInArray(check, actives.user.matches, ['teamId1', 'teamId2'])

                }

                if (!exist) {

                    actives.user.matches = [
                        ...actives.user.matches,
                        ...result.items.map((x) => {
                            return {
                                ...x,
                                coords  : JSON.parse(x.coords),
                                patches : JSON.parse(x.patches),
                                reqStat : JSON.parse(x.reqStat),
                                members : {
                                    members     : [],
                                    nextToken1  : null,
                                    nextToken2  : null,
                                    nextToken   : null
                                }
                            }
                        })
                    ]

                }

            }


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

        // init states

        const userState = ctx.rootGetters['user/get']
        const matchesState = ctx.getters.get

        const requests = matchesState.requests


        if (!requests.teams.length && userState.teams.length) {

            requests.teams = userState.teams.map((team) => {

                return {
                    ...team,
                    requests: { requests: [], nextToken: null }
                }

            })

        }


        // fetch each team's requests

        for (const team of requests.teams) {

            try {

                this.$AWS.Amplify.configure(awsconfig.umt)

                let result = await this.$AWS.API.graphql(graphqlOperation(
                    umt.queries.matchRequests,
                    {
                        id          : team.id,
                        nextToken   : team.nextToken
                    }
                ))

                result = result.data.matchRequests
                team.requests.nextToken = result.nextToken


                // append data to state

                if (result.items) {

                    // check if new requests exist in current loaded requests.
                    // if yes, it means that we scan all dynamodb data. So, we
                    // don't should append it to avoid duplicates.

                    let exist = false

                    if (team.requests.requests.length) {

                        const check = result.items[0]

                        exist = objectInArray(check, team.requests.requests, ['teamId1', 'teamId2'])

                    }

                    if (!exist) {

                        team.requests.requests = [
                            ...team.requests.requests,
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

                }


                // fetch each match's opponent info

                for (const match of team.requests.requests) {

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

            this.$AWS.Amplify.configure(awsconfig.umt)

            let result = await this.$AWS.API.graphql(graphqlOperation(
                umt.queries.matchPatchRequests,
                {
                    email       : userState.email,
                    nextToken   : requests.user.nextToken
                }
            ))

            result = result.data.matchPatchRequests
            requests.user.nextToken = result.nextToken


            // append data to state

            if (result.items) {

                // check if new requests exist in current loaded requests.
                // if yes, it means that we scan all dynamodb data. So, we
                // don't should append it to avoid duplicates.

                let exist = false

                if (requests.user.requests.length) {

                    const check = result.items[0]

                    exist = objectInArray(check, requests.user.requests, ['teamId1', 'teamId2'])

                }

                if (!exist) {

                    requests.user.requests = [
                        ...requests.user.requests,
                        ...result.items.map((x) => {
                            return {
                                ...x,
                                reqStat : JSON.parse(x.reqStat)
                            }
                        })
                    ]

                }

            }


            // fetch each match's teams info

            for (const match of requests.user.requests) {

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

            this.$AWS.API.graphql(graphqlOperation(
                umt.mutations.updateMatch,
                {
                    ...data,
                    coords  : JSON.stringify(data.coords),
                    patches : JSON.stringify(data.patches),
                    reqStat : JSON.stringify(data.reqStat)
                })
            )

                // success
                .then(() => {

                    // remove request from requests

                    for (const team of matchesState.requests.teams) {
                        team.requests.requests = team.requests.requests.filter(
                            request => `${request.teamId1}${request.teamId2}` !== `${data.teamId1}${data.teamId2}`
                        )
                    }

                    // build response message

                    if (data.action === 'reject') {

                        const response = {
                            type    : 'success',
                            title   : '¡Solicitud cancelada!',
                            msg     : 'La solicitud ha sido cancelada.'
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


                        // add request to actives

                        for (const team of matchesState.actives.teams) {

                            team.matches.matches = [
                                ...team.matches.matches,
                                {
                                    ...data,
                                    chat: {
                                        messages    : [],
                                        nextToken   : null
                                    },
                                    members: {
                                        members     : [],
                                        nextToken1  : null,
                                        nextToken2  : null,
                                        nextToken   : null
                                    }
                                }
                            ]

                        }


                        // update store

                        const params = {
                            requests: matchesState.requests,
                            actives : matchesState.actives
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

            this.$AWS.API.graphql(graphqlOperation(
                umt.mutations.updateMatchPatch,
                {
                    ...data,
                    reqStat: JSON.stringify(data.reqStat)
                })
            )

                // success
                .then(async () => {

                    // remove request from requests

                    matchesState.requests.user.requests = matchesState.requests.user.requests.filter(
                        request => `${request.teamId1}${request.teamId2}` !== `${data.teamId1}${data.teamId2}`
                    )


                    // build response message

                    if (data.action === 'reject') {

                        const response = {
                            type    : 'success',
                            title   : '¡Solicitud cancelada!',
                            msg     : 'La solicitud ha sido cancelada.'
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

                        // fetch match's info to add to actives later

                        try {

                            let result = await this.$AWS.API.graphql(graphqlOperation(
                                umt.queries.getMatch,
                                {
                                    teamId1: data.teamId1,
                                    teamId2: data.teamId2
                                }
                            ))

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
                                        },
                                        members: {
                                            members     : [],
                                            nextToken1  : null,
                                            nextToken2  : null,
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

            if (team.id === data.teamId1 || team.id === data.teamId2) {

                team.matches.matches = team.matches.matches.map((match) => {

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

            this.$AWS.API.graphql(graphqlOperation(
                umt.mutations.addMatchChat,
                {
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


    async listTeamMembers (ctx, data) {

        const matchesState = ctx.getters.get


        // fetch each user's requests

        this.$AWS.Amplify.configure(awsconfig.umt)

        try {

            // team 1 members

            let result1 = await this.$AWS.API.graphql(graphqlOperation(
                umt.queries.listTeamMembers,
                {
                    teamId      : data.teamId1,
                    nextToken   : data.members.nextToken1
                }
            ))

            const nextToken1 = result1.data.listTeamMembers.nextToken
            result1 = result1.data.listTeamMembers.items || []

            // team 2 members

            let result2 = await this.$AWS.API.graphql(graphqlOperation(
                umt.queries.listTeamMembers,
                {
                    teamId      : data.teamId2,
                    nextToken   : data.members.nextToken2
                }
            ))

            const nextToken2 = result2.data.listTeamMembers.nextToken
            result2 = result2.data.listTeamMembers.items || []

            // match patches

            let result3 = await this.$AWS.API.graphql(graphqlOperation(
                umt.queries.listMatchPatches,
                {
                    teamId1     : data.teamId1,
                    teamId2     : data.teamId2,
                    nextToken   : data.members.nextToken
                }
            ))

            const nextToken = result3.data.listMatchPatches.nextToken
            result3 = result3.data.listMatchPatches.items || []


            if (result1.length + result2.length + result3.length) {

                let exist1 = false
                let exist2 = false
                let exist3 = false

                if (data.members.members.length) {

                    const check1 = result1[0]
                    const check2 = result2[0]
                    const check3 = result3[0]

                    exist1 = result1.length ? objectInArray(check1, data.members.members, ['email']) : false
                    exist2 = result2.length ? objectInArray(check2, data.members.members, ['email']) : false
                    exist3 = result3.length ? objectInArray(check3, data.members.members, ['email']) : false

                }

                if (!exist1 || !exist2 || !exist3) {

                    let result = []

                    // fetch picture of each player

                    this.$AWS.Amplify.configure(awsconfig.arv)


                    if (!exist1) {

                        for (const player of result1) {

                            const user = await this.$AWS.API.graphql(graphqlOperation(
                                arv.queries.getUser,
                                {
                                    email: player.email
                                }
                            ))

                            player.picture = user.data.getUser.picture

                        }

                        result = [...result, ...result1]

                    }


                    if (!exist2) {

                        for (const player of result2) {

                            const user = await this.$AWS.API.graphql(graphqlOperation(
                                arv.queries.getUser,
                                {
                                    email: player.email
                                }
                            ))

                            player.picture = user.data.getUser.picture

                        }

                        result = [...result, ...result2]

                    }


                    if (!exist3) {

                        for (const player of result3) {

                            const user = await this.$AWS.API.graphql(graphqlOperation(
                                arv.queries.getUser,
                                {
                                    email: player.email
                                }
                            ))

                            player.picture = user.data.getUser.picture

                        }

                        result = [...result, ...result3]

                    }


                    // append data for team matches

                    matchesState.actives.teams = matchesState.actives.teams.map((team) => {

                        if (team.id === data.teamId1 || team.id === data.teamId2) {

                            team.matches.matches = team.matches.matches.map((match) => {

                                if (match.teamId1 === data.teamId1 && match.teamId2 === data.teamId2) {

                                    match.members.members = [
                                        ...match.members.members,
                                        ...result
                                    ]
                                    match.members.nextToken1 = nextToken1
                                    match.members.nextToken2 = nextToken2
                                    match.members.nextToken = nextToken

                                }

                                return match

                            })

                        }

                        return team

                    })


                    // append message to chat for user matches

                    matchesState.actives.user.matches = matchesState.actives.user.matches.map((match) => {

                        if (match.teamId1 === data.teamId1 && match.teamId2 === data.teamId2) {

                            match.members.members = [
                                ...match.members.members,
                                ...result
                            ]
                            match.members.nextToken1 = nextToken1
                            match.members.nextToken2 = nextToken2
                            match.members.nextToken = nextToken

                        }

                        return match

                    })

                }

            }


            // update store

            const params = { actives: matchesState.actives }
            ctx.commit('setState', { params })

        }

        catch (err) {
            const response = { ...errorNotification, err }
            throw response
        }

    },


    searchPlayer (ctx, data) {

        return new Promise((resolve, reject) => {

            this.$AWS.Amplify.configure(awsconfig.arv)

            this.$AWS.API.graphql(graphqlOperation(arv.queries.getUser,
                {
                    email: data.email
                })
            )

                // success
                .then((result) => {
                    resolve(result.data.getUser)
                })

                // error
                .catch((err) => {
                    const response = { ...errorNotification, err }
                    reject(response)
                })

        })

    },


    async addPlayer (ctx, data) {

        try {

            this.$AWS.Amplify.configure(awsconfig.umt)

            await this.$AWS.API.graphql(graphqlOperation(
                umt.mutations.addMatchPatch,
                {
                    teamId1 : data.teamId1,
                    teamId2 : data.teamId2,
                    email   : data.email,
                    name    : data.firstName,
                    expireOn: data.expireOn,
                    reqStat : JSON.stringify({
                        MR: { S: 'A' },
                        PR: { S: 'P' }
                    })
                })
            )

            const response = {
                type    : 'success',
                title   : '¡Solicitud enviada!',
                msg     : 'La solicitud al jugador fue enviada.'
            }

            return response

        }

        catch (err) {

            const errorCode = JSON.parse(err.errors[0].message)

            let response = {}

            switch (errorCode.code) {


            // player already into the match

            case 'MatchPatchExistException': {
                response = {
                    type    : 'error',
                    title   : '¡Jugador existente!',
                    msg     : errorCode.message
                }
                break
            }


            // the match is expired

            case 'MatchExpiredException': {
                response = {
                    type    : 'error',
                    title   : '¡Partido expirado!',
                    msg     : errorCode.message
                }
                break
            }


            // user already has a request for the match

            case 'MatchPatchRequestException': {
                response = {
                    type    : 'error',
                    title   : '¡Solicitud existente!',
                    msg     : errorCode.message
                }
                break
            }


            // match is full

            case 'MatchPatchFullException': {
                response = {
                    type    : 'error',
                    title   : '¡Cupos completos!',
                    msg     : errorCode.message
                }
                break
            }


            // unknown error

            default: {
                response = errorNotification
                break
            }

            }

            response = { ...response, err }
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
