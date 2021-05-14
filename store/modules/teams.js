import { graphqlOperation } from '@aws-amplify/api'
import { umt, arv } from '@/graphql/gql'
import errorNotification from '@/static/data/errorNotification.json'
import awsconfig from '~/aws-exports'


// get default state value

const getDefaultState = () => ({

    // array and object must be stringified to be reactive

    teamsChatMessages   : '[]',
    teamsRequests       : '[]',
    teamMemberRequests  : JSON.stringify({
        requests    : [],
        nextToken   : null
    }),
    teamMembers         : '[]'
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

    async listTeamChats (ctx, data) {

        this.$AWS.Amplify.configure(awsconfig.umt)


        // init states

        const userTeams = ctx.rootGetters['user/get'].teams
        const teamsState = ctx.getters.get


        // validate that the user has teams

        if (!userTeams) {
            return null
        }


        // init messages for each team

        let teamsChatMessages = teamsState.teamsChatMessages

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
                    teamsChatMessages
                }

                ctx.commit('setState', { params })
            }

            catch (err) {
                const response = { ...errorNotification, err }

                throw response
            }
        }
    },


    async teamRequests (ctx, data) {

        // TODO: Make nextToken logic!

        // init states

        const userTeams = ctx.rootGetters['user/get'].teams
        const teamsState = ctx.getters.get


        // validate that the user has teams

        if (!userTeams) {
            return null
        }


        // init requests for each team

        let teamsRequests = teamsState.teamsRequests

        if (!teamsRequests.length) {
            teamsRequests = userTeams.map((team) => {
                return {
                    id          : team.id,
                    requests    : [],
                    nextToken   : null
                }
            })
        }


        // fetch each team's requests

        for (const i in userTeams) {

            try {

                this.$AWS.Amplify.configure(awsconfig.umt)

                let result = await this.$AWS.API.graphql(
                    graphqlOperation(
                        umt.queries.teamRequests,
                        {
                            id          : userTeams[i].id,
                            nextToken   : teamsRequests[i].nextToken
                        }
                    )
                )

                result = result.data.teamRequests
                teamsRequests[i].nextToken = result.nextToken


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


                            // append to state

                            teamsRequests[i].requests.push({
                                ...teamMember,
                                picture     : userInfo.data.getUser.picture,
                                reqStat     : JSON.parse(teamMember.reqStat),
                                position    : JSON.parse(teamMember.position)
                            })
                        }

                        catch (err) {
                            const response = { ...errorNotification, err }

                            throw response
                        }
                    }
                }


                // save in store

                const params = { teamsRequests }

                ctx.commit('setState', { params })
            }

            catch (err) {
                const response = { ...errorNotification, err }

                throw response
            }
        }
    },


    async teamMemberRequests (ctx, data) {

        // TODO: Make nextToken logic!

        // init states

        const userState = ctx.rootGetters['user/get']
        const teamsState = ctx.getters.get


        // init requests

        const teamMemberRequests = teamsState.teamMemberRequests


        // fetch team's requests to the player

        try {

            this.$AWS.Amplify.configure(awsconfig.umt)

            let result = await this.$AWS.API.graphql(
                graphqlOperation(
                    umt.queries.teamMemberRequests,
                    {
                        email       : userState.email,
                        nextToken   : teamMemberRequests.nextToken
                    }
                )
            )

            result = result.data.teamMemberRequests
            teamMemberRequests.nextToken = result.nextToken


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

                        teamMemberRequests.requests.push({
                            ...teamMember,
                            name        : teamInfo.data.getTeam.name,
                            picture     : teamInfo.data.getTeam.picture,
                            reqStat     : JSON.parse(teamMember.reqStat),
                            position    : JSON.parse(teamMember.position)
                        })
                    }

                    catch (err) {
                        const response = { ...errorNotification, err }

                        throw response
                    }
                }
            }


            // save in store

            const params = { teamMemberRequests }

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
                    const userTeams = userState.teams ? [...userState.teams] : []


                    // set team in chat list

                    teamsState.teamsChatMessages.push({
                        id          : addTeamResult.id,
                        messages    : [],
                        nextToken   : null
                    })

                    params = { teamsChatMessages: teamsState.teamsChatMessages }

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


                    // add the user to the team

                    try {
                        await this.$AWS.API.graphql(
                            graphqlOperation(
                                umt.mutations.addTeamMember,
                                {
                                    teamId  : addTeamResult.id,
                                    email   : userState.email,
                                    role    : ['Admin', 'Player', 'Captain'],
                                    reqStat : JSON.stringify({ TR:{ S:'A' }, PR:{ S:'A' } })
                                }
                            )
                        )
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

                    try {

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
                    }

                    catch (e) {
                        reject(response)
                    }
                })
        })
    },


    updateTeamMember (ctx, data) {

        // load states

        const teamsState = ctx.getters.get


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
                .then(() => {

                    // build response message

                    let response = {
                        type    : 'success',
                        title   : '¡Solicitud aceptada!',
                        msg     : 'La solicitud ha sido aceptada.'
                    }

                    if (data.action === 'reject') {
                        response = {
                            ...response,
                            title   : '¡Solicitud cancelada!',
                            msg     : 'La solicitud ha sido cancelada.'
                        }
                    }


                    // remove request from store

                    const newTeamMemberRequests = {
                        ...teamsState.teamMemberRequests,
                        requests: teamsState.teamMemberRequests.requests.filter(
                            teamMember =>
                                `${teamMember.teamId}${teamMember.email}` !==
                                `${data.teamId}${data.email}`
                        )
                    }


                    const newTeamsRequests = teamsState.teamsRequests.map((team) => {

                        return {
                            ...team,
                            requests: team.requests.filter(
                                teamMember =>
                                    `${teamMember.teamId}${teamMember.email}` !==
                                    `${data.teamId}${data.email}`
                            )
                        }
                    })


                    // update store

                    const params = {
                        teamMemberRequests  : newTeamMemberRequests,
                        teamsRequests       : newTeamsRequests
                    }

                    ctx.commit('setState', { params })

                    resolve(response)
                })


                // error
                .catch((err) => {
                    const response = { ...errorNotification, err }

                    reject(response)
                })
        })
    },


    addTeamChat (ctx, data) {

        // load states

        const teamsState = ctx.getters.get
        const userState = ctx.rootGetters['user/get']


        // append message to chat

        const newTeamsChatMessages = teamsState.teamsChatMessages.map((team) => {
            if (team.id === data.teamId) {
                team.messages.unshift({
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
            teamsChatMessages: newTeamsChatMessages
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

            let result = await this.$AWS.API.graphql(
                graphqlOperation(
                    umt.queries.listTeamMembers,
                    {
                        teamId      : data.teamId,
                        nextToken   : null
                    }
                )
            )

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


            const params = {
                teamMembers: result
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
