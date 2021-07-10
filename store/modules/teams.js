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
    }),

    teamMembers: '[]'

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

    async listTeamChats (ctx, data) {

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
                    teamId  : team.id,
                    chat    : { messages: [], nextToken: null }
                }

            })

        }


        // fetch each team chat's messages

        for (const team of actives.teams) {

            try {

                let result = await this.$AWS.API.graphql(
                    graphqlOperation(
                        umt.queries.listTeamChats,
                        {
                            id          : team.teamId,
                            nextToken   : team.nextToken
                        }
                    )
                )

                result = result.data.listTeamChats
                team.chat.nextToken = result.nextToken


                // add data

                if (result.items) {

                    team.chat.messages = [
                        ...team.chat.messages,
                        ...result.items
                    ]

                }


                // deduplicate

                team.chat.messages = team.chat.messages.reduce((acc, current) => {

                    return deduplicate(acc, current, 'email', 'sentOn')

                }, [])

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

        this.$AWS.Amplify.configure(awsconfig.umt)


        // init states

        const userState = ctx.rootGetters['user/get']
        const teamsState = ctx.getters.get

        const requests = teamsState.requests


        // init requests for each team

        if (!requests.teams.length && userState.teams.length) {

            requests.teams = userState.teams.map((team) => {

                return {
                    teamId      : team.id,
                    requests    : [],
                    nextToken   : null
                }

            })

        }


        // fetch each team's requests

        for (const team of requests.teams) {

            try {

                let result = await this.$AWS.API.graphql(graphqlOperation(
                    umt.queries.teamRequests,
                    {
                        id          : team.teamId,
                        nextToken   : team.nextToken
                    }
                ))

                result = result.data.teamRequests
                team.nextToken = result.nextToken


                // add data

                if (result.items) {

                    for (const teamMember of result.items) {

                        // fetch user picture

                        this.$AWS.Amplify.configure(awsconfig.arv)

                        try {

                            const userInfo = await this.$AWS.API.graphql(
                                graphqlOperation(arv.queries.getUser, {
                                    email: teamMember.email
                                })
                            )

                            team.requests = [
                                ...team.requests,
                                {
                                    ...teamMember,
                                    picture     : userInfo.data.getUser.picture,
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


                    // deduplicate

                    team.requests = team.requests.reduce((acc, current) => {

                        return deduplicate(acc, current, 'teamId', 'email')

                    }, [])

                }

            }

            catch (err) {
                const response = { ...errorNotification, err }
                throw response
            }

        }


        // fetch team's requests to the player

        try {

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

                for (const teamMember of result.items) {

                    // fetch team picture

                    try {

                        const teamInfo = await this.$AWS.API.graphql(
                            graphqlOperation(umt.queries.getTeam, {
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


                // deduplicate

                requests.user.requests = requests.user.requests.reduce((acc, current) => {

                    return deduplicate(acc, current, 'teamId', 'email')

                }, [])

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

            this.$AWS.API.graphql(
                graphqlOperation(umt.mutations.addTeam, params)
            )

                // success
                .then(async (result) => {

                    const addTeamResult = result.data.addTeam
                    const userTeams = userState.teams || []


                    // set team in chat list

                    teamsState.actives.teams.push({
                        teamId  : addTeamResult.id,
                        chat    : { messages: [], nextToken: null }
                    })


                    params = { actives: teamsState.actives }
                    ctx.commit('setState', { params })


                    // set teams in user store

                    userTeams.push({
                        id              : addTeamResult.id,
                        name            : addTeamResult.name,
                        picture         : addTeamResult.picture,
                        formation       : JSON.parse(addTeamResult.formation),
                        geohash         : addTeamResult.geohash,
                        coords          : JSON.parse(addTeamResult.coords),
                        genderFilter    : addTeamResult.genderFilter,
                        ageMinFilter    : addTeamResult.ageMinFilter,
                        ageMaxFilter    : addTeamResult.ageMaxFilter,
                        matchFilter     : addTeamResult.matchFilter
                    })


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

            this.$AWS.API.graphql(
                graphqlOperation(umt.mutations.updateTeamMember, {
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


                        // remove request from store

                        for (const team of teamsState.requests.teams) {
                            team.requests = team.requests.filter(
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


                        // remove request from store

                        for (const team of teamsState.requests.teams) {
                            team.requests = team.requests.filter(
                                request => `${request.teamId}${request.email}` !== `${data.teamId}${data.email}`
                            )
                        }


                        teamsState.requests.user.requests = teamsState.requests.user.requests.filter(
                            request => `${request.teamId}${request.email}` !== `${data.teamId}${data.email}`
                        )


                        // add team to list of user's teams

                        if (data.email === userState.email) {

                            const userTeams = userState.teams || []


                            // fetc team information

                            try {

                                const result = await this.$AWS.API.graphql(graphqlOperation(
                                    umt.mutations.getTeam,
                                    {
                                        id: data.teamId
                                    }
                                ))

                                // set teams in user store

                                userTeams.push({
                                    id              : result.id,
                                    name            : result.name,
                                    picture         : result.picture,
                                    formation       : JSON.parse(result.formation),
                                    geohash         : result.geohash,
                                    coords          : JSON.parse(result.coords),
                                    genderFilter    : result.genderFilter,
                                    ageMinFilter    : result.ageMinFilter,
                                    ageMaxFilter    : result.ageMaxFilter,
                                    matchFilter     : result.matchFilter
                                })


                                const params = { teams: userTeams }
                                ctx.commit('user/setState', { params }, { root: true })


                                // set primary team only if its the first team added

                                if (userTeams.length === 1) {
                                    const params = { primaryTeam: userTeams[0] }
                                    ctx.commit('user/setState', { params }, { root: true })
                                }


                                // add team to actives

                                teamsState.actives.teams.push({
                                    teamId  : result.id,
                                    chat    : { messages: [], nextToken: null }
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

            if (team.teamId === data.teamId) {

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

        const params = {
            actives: teamsState.actives
        }

        ctx.commit('setState', { params })


        // save into dynamoDB

        return new Promise((resolve, reject) => {

            this.$AWS.Amplify.configure(awsconfig.umt)

            this.$AWS.API.graphql(
                graphqlOperation(umt.mutations.addTeamChat, {
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

        // TODO: Make nextToken logic!

        this.$AWS.Amplify.configure(awsconfig.umt)


        try {

            let result = await this.$AWS.API.graphql(graphqlOperation(
                umt.queries.listTeamMembers,
                {
                    teamId      : data.teamId,
                    nextToken   : null
                }
            ))

            result = result.data.listTeamMembers.items
            // TODO: Fix this! teamsChatMessages[i].nextToken = result.data.listTeamChats.nextToken


            for (const i in result) {

                const teamMember = result[i]


                // fetch player picture

                try {

                    this.$AWS.Amplify.configure(awsconfig.arv)

                    const playerInfo = await this.$AWS.API.graphql(
                        graphqlOperation(arv.queries.getUser, {
                            email: teamMember.email
                        })
                    )


                    // append to state

                    result[i] = {
                        ...teamMember,
                        picture: playerInfo.data.getUser.picture
                    }

                }

                catch (err) {
                    const response = { ...errorNotification, err }
                    throw response
                }

            }


            const params = { teamMembers: result }
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

            this.$AWS.API.graphql(
                graphqlOperation(arv.queries.getUser, {
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
