import { graphqlOperation } from '@aws-amplify/api'
import { umt, arv } from '@/graphql/gql'
import errorNotification from '@/static/data/errorNotification.json'
import awsconfig from '~/aws-exports'


// get default state value

const getDefaultState = () => ({

    // array and object must be stringified to be reactive

    actives: JSON.stringify({
        teams: []
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

        else {
            return false
        }

    }

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

        // TODO: review why this functions is called twice in mounted

        this.$AWS.Amplify.configure(awsconfig.umt)


        // init states

        const userState = ctx.rootGetters['user/get']
        const teamsState = ctx.getters.get

        const actives = teamsState.actives


        // validate that the user has teams

        if (!userState.teams) {
            return null
        }


        // init messages for each team

        if (!actives.teams.length) {

            actives.teams = userState.teams.map((team) => {

                return {
                    ...team,
                    chat    : { messages: [], nextToken: null },
                    members : { members: [], nextToken: null }
                }

            })

        }


        // fetch each team chat's messages

        for (const team of actives.teams) {

            try {

                let result = await this.$AWS.API.graphql(graphqlOperation(
                    umt.queries.listTeamChats,
                    {
                        id          : team.id,
                        nextToken   : team.chat.nextToken
                    }
                ))

                result = result.data.listTeamChats
                team.chat.nextToken = result.nextToken


                // add data

                if (result.items) {

                    // check if new messages exist in current loaded messages.
                    // if yes, it means that we scan all dynamodb data. So, we
                    // don't should append it to avoid duplicates.

                    let exist = false

                    if (team.chat.messages.length) {

                        const check = result.items[0]

                        exist = objectInArray(check, team.chat.messages, ['teamId', 'email', 'sentOn', 'msg'])

                    }

                    if (!exist || !team.chat.messages.length) {

                        team.chat.messages = [
                            ...team.chat.messages,
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

        const params = { actives }
        ctx.commit('setState', { params })

    },


    async listRequests (ctx, data) {

        // init states

        const userState = ctx.rootGetters['user/get']
        const teamsState = ctx.getters.get

        const requests = teamsState.requests


        // init requests for each team

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
                    umt.queries.teamRequests,
                    {
                        id          : team.id,
                        nextToken   : team.requests.nextToken
                    }
                ))

                result = result.data.teamRequests
                team.requests.nextToken = result.nextToken


                // add data

                if (result.items) {


                    // check if new requests exist in current loaded requests.
                    // if yes, it means that we scan all dynamodb data. So, we
                    // don't should append it to avoid duplicates.

                    let exist = false

                    if (team.requests.requests.length) {

                        const check = result.items[0]

                        exist = objectInArray(check, team.requests.requests, ['teamId', 'email', 'joinedOn'])

                    }

                    if (!exist || !team.requests.requests.length) {

                        // fetch each user request picture

                        for (const teamMember of result.items) {

                            this.$AWS.Amplify.configure(awsconfig.arv)

                            try {

                                const userInfo = await this.$AWS.API.graphql(graphqlOperation(
                                    arv.queries.getUser,
                                    {
                                        email: teamMember.email
                                    })
                                )

                                team.requests.requests = [
                                    ...team.requests.requests,
                                    {
                                        ...teamMember,
                                        picture : userInfo.data.getUser.picture,
                                        reqStat : JSON.parse(teamMember.reqStat),
                                        position: JSON.parse(teamMember.position)
                                    }
                                ]

                            }

                            catch (err) {
                                const response = { ...errorNotification, err }
                                throw response
                            }

                        }

                    }

                }

            }

            catch (err) {
                const response = { ...errorNotification, err }
                throw response
            }

        }


        // fetch team's requests to the player

        try {

            this.$AWS.Amplify.configure(awsconfig.umt)

            let result = await this.$AWS.API.graphql(graphqlOperation(
                umt.queries.teamMemberRequests,
                {
                    email       : userState.email,
                    nextToken   : requests.user.nextToken
                }
            ))

            result = result.data.teamMemberRequests
            requests.user.nextToken = result.nextToken


            // add data

            if (result.items) {

                // check if new requests exist in current loaded requests.
                // if yes, it means that we scan all dynamodb data. So, we
                // should not append it to avoid duplicates.

                let exist = false

                if (requests.user.requests.length) {

                    const check = result.items[0]

                    exist = objectInArray(check, requests.user.requests, ['teamId', 'email', 'joinedOn'])

                }

                if (!exist || !requests.user.requests.length) {

                    for (const teamMember of result.items) {

                        // fetch team picture

                        try {

                            const teamInfo = await this.$AWS.API.graphql(graphqlOperation(
                                umt.queries.getTeam,
                                {
                                    id: teamMember.teamId
                                })
                            )


                            // append to state

                            requests.user.requests = [
                                ...requests.user.requests,
                                {
                                    ...teamMember,
                                    name        : teamInfo.data.getTeam.name,
                                    picture     : teamInfo.data.getTeam.picture,
                                    reqStat     : JSON.parse(teamMember.reqStat),
                                    position    : JSON.parse(teamMember.position)
                                }
                            ]

                        }

                        catch (err) {
                            const response = { ...errorNotification, err }
                            throw response
                        }

                    }

                }

            }


            // save in store

            const params = { requests }
            ctx.commit('setState', { params })

        }

        catch (err) {
            const response = { ...errorNotification, err }
            throw response
        }

    },


    createTeam (ctx, data) {

        const userState = ctx.rootGetters['user/get']
        const teamsState = ctx.getters.get

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

            this.$AWS.API.graphql(graphqlOperation(umt.mutations.addTeam, params))

                // success
                .then(async (result) => {

                    const addTeamResult = {
                        ...result.data.addTeam,
                        formation   : JSON.parse(result.data.addTeam.formation),
                        coords      : JSON.parse(result.data.addTeam.coords)
                    }

                    const userTeams = userState.teams || []


                    // set team in actives

                    teamsState.actives.teams.push({
                        ...addTeamResult,
                        chat: { messages: [], nextToken: null }
                    })


                    params = { actives: teamsState.actives }
                    ctx.commit('setState', { params })


                    // set teams in user store

                    userTeams.push(addTeamResult)


                    params = { teams: userTeams }
                    ctx.commit('user/setState', { params }, { root: true })


                    // add the user to the team as owner

                    try {
                        await this.$AWS.API.graphql(graphqlOperation(
                            umt.mutations.addTeamMember,
                            {
                                teamId  : addTeamResult.id,
                                email   : userState.email,
                                name    : userState.firstName,
                                role    : ['Admin', 'Player', 'Captain'],
                                reqStat : JSON.stringify({ TR:{ S:'A' }, PR:{ S:'A' } })
                            }
                        ))
                    }

                    catch (err) {
                        const response = { ...errorNotification, err }
                        // TODO: remove the team created
                        throw response
                    }


                    // set primary team only if its the first team added

                    if (userTeams.length === 1) {
                        params = { primaryTeam: userTeams[0] }
                        ctx.commit('user/setState', { params }, { root: true })
                    }

                    const response = {
                        type    : 'success',
                        title   : '¡Equipo creado!',
                        msg     : 'El equipo fue creado exitosamente.'
                    }

                    resolve(response)

                })


                // error
                .catch((err) => {

                    let response = { ...errorNotification, err }

                    const error = JSON.parse(err.errors[0].message)

                    switch (error.code) {

                    // team already exists

                    case 'TeamExistException': {
                        response = {
                            type    : 'error',
                            title   : '¡El equipo ya existe!',
                            msg     : error.message,
                            err
                        }

                        break
                    }

                    // unknown error

                    default:
                        break

                    }

                    reject(response)

                })

        })

    },


    updateRequest (ctx, data) {

        // load states

        const teamsState = ctx.getters.get
        const userState = ctx.rootGetters['user/get']


        return new Promise((resolve, reject) => {

            this.$AWS.Amplify.configure(awsconfig.umt)

            this.$AWS.API.graphql(graphqlOperation(
                umt.mutations.updateTeamMember,
                {
                    teamId      : data.teamId,
                    email       : data.email,
                    name        : data.name,
                    role        : data.role,
                    reqStat     : JSON.stringify(data.reqStat),
                    position    : JSON.stringify(data.position),
                    number      : data.number
                })
            )

                // success
                .then(async () => {

                    if (data.action === 'reject') {

                        const response = {
                            type    : 'success',
                            title   : '¡Solicitud cancelada!',
                            msg     : 'La solicitud ha sido cancelada.'
                        }


                        // remove request from store for both (teams and user)

                        for (const team of teamsState.requests.teams) {
                            team.requests.requests = team.requests.requests.filter(
                                request => `${request.teamId}${request.email}` !== `${data.teamId}${data.email}`
                            )
                        }

                        teamsState.requests.user.requests = teamsState.requests.user.requests.filter(
                            request => `${request.teamId}${request.email}` !== `${data.teamId}${data.email}`
                        )


                        // update store

                        const params = {
                            requests: teamsState.requests
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


                        // remove request from store for both (teams and user)

                        for (const team of teamsState.requests.teams) {
                            team.requests.requests = team.requests.requests.filter(
                                request => `${request.teamId}${request.email}` !== `${data.teamId}${data.email}`
                            )
                        }

                        teamsState.requests.user.requests = teamsState.requests.user.requests.filter(
                            request => `${request.teamId}${request.email}` !== `${data.teamId}${data.email}`
                        )


                        // add team to list of user's teams

                        if (data.email === userState.email) {

                            const userTeams = userState.teams || []


                            // fetch team information

                            try {

                                let result = await this.$AWS.API.graphql(graphqlOperation(
                                    umt.mutations.getTeam,
                                    {
                                        id: data.teamId
                                    }
                                ))


                                // set teams in user store

                                result = {
                                    ...result,
                                    formation   : JSON.parse(result.formation),
                                    coords      : JSON.parse(result.coords)
                                }

                                userTeams.push(result)


                                const params = { teams: userTeams }
                                ctx.commit('user/setState', { params }, { root: true })


                                // set primary team only if its the first team added

                                if (userTeams.length === 1) {
                                    const params = { primaryTeam: userTeams[0] }
                                    ctx.commit('user/setState', { params }, { root: true })
                                }


                                // add team to actives

                                teamsState.actives.teams.push({
                                    ...result,
                                    chat: { messages: [], nextToken: null }
                                })

                            }

                            catch (err) {
                                const response = { ...errorNotification, err }
                                throw response
                            }

                        }


                        // update store

                        const params = {
                            actives : teamsState.actives,
                            requests: teamsState.requests
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

        const teamsState = ctx.getters.get
        const userState = ctx.rootGetters['user/get']


        // append message to chat

        teamsState.actives.teams = teamsState.actives.teams.map((team) => {

            if (team.id === data.teamId) {

                team.chat.messages.unshift({
                    teamId  : data.teamId,
                    email   : userState.email,
                    sentOn  : new Date().toISOString(),
                    author  : userState.firstName,
                    msg     : data.msg
                })

            }

            return team

        })


        // update store

        const params = { actives: teamsState.actives }
        ctx.commit('setState', { params })


        // save into dynamoDB

        return new Promise((resolve, reject) => {

            this.$AWS.Amplify.configure(awsconfig.umt)

            this.$AWS.API.graphql(graphqlOperation(
                umt.mutations.addTeamChat,
                {
                    teamId  : data.teamId,
                    email   : userState.email,
                    author  : userState.firstName,
                    msg     : data.msg
                })
            )

                // success
                .then((result) => {
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

        this.$AWS.Amplify.configure(awsconfig.umt)


        // load states

        const teamsState = ctx.getters.get


        try {

            let result = await this.$AWS.API.graphql(graphqlOperation(
                umt.queries.listTeamMembers,
                {
                    teamId      : data.id,
                    nextToken   : null
                }
            ))

            result = result.data.listTeamMembers


            // add team members to the team

            for (const team of teamsState.actives.teams) {

                if (team.id === data.id) {

                    if (!team.members) {
                        team.members = { members: [], nextToken: null }
                    }

                    team.members.nextToken = result.nextToken

                    if (result.items) {

                        // check if new members exist in current loaded members.
                        // if yes, it means that we scan all dynamodb data. So, we
                        // should not append it to avoid duplicates.

                        let exist = false

                        if (team.members.members.length) {

                            const check = result.items[0]

                            exist = objectInArray(check, team.members.members, ['email'])

                        }

                        if (!exist || !team.members.members.length) {

                            // fetch player picture

                            for (const player of result.items) {

                                try {

                                    this.$AWS.Amplify.configure(awsconfig.arv)

                                    const playerInfo = await this.$AWS.API.graphql(graphqlOperation(
                                        arv.queries.getUser,
                                        {
                                            email: player.email
                                        })
                                    )


                                    // append to state

                                    team.members.members = [
                                        ...team.members.members,
                                        {
                                            ...player,
                                            picture: playerInfo.data.getUser.picture
                                        }
                                    ]

                                }

                                catch (err) {
                                    const response = { ...errorNotification, err }
                                    throw response
                                }

                            }

                        }

                    }

                }

            }


            const params = { actives: teamsState.actives }
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


    addPlayer (ctx, data) {

        return new Promise((resolve, reject) => {

            this.$AWS.Amplify.configure(awsconfig.umt)

            this.$AWS.API.graphql(graphqlOperation(umt.mutations.addTeamMember, {
                teamId  : data.teamId,
                email   : data.email,
                name    : data.firstName,
                role    : null,
                reqStat : JSON.stringify({
                    TR: { S: 'A' },
                    PR: { S: 'P' }
                })
            })
            )

                // success
                .then(() => {

                    const response = {
                        type    : 'success',
                        title   : '¡Solicitud enviada!',
                        msg     : 'La solicitud al jugador fue enviada.'
                    }

                    resolve(response)

                })

                // error
                .catch((err) => {

                    const errorCode = JSON.parse(err.errors[0].message)

                    let response = {}

                    switch (errorCode.code) {

                    // player already join team

                    case 'TeamMemberExistException': {
                        response = {
                            type    : 'error',
                            title   : '¡Jugador en el equipo!',
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
