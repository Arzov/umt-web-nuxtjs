let root = ''
const mutations = 'mutations/'
const queries = 'queries/'


// arzov api graphql definition

root = './arv/'

export const arv = {
    queries: {
        ...require(`${root}${queries}getUser`)
    },

    mutations: {
        ...require(`${root}${mutations}updateUser`)
    }
}


// umatch api graphql definition

root = './umt/'

export const umt = {
    queries: {
        ...require(`${root}${queries}getUser`),
        ...require(`${root}${queries}getTeam`),
        ...require(`${root}${queries}listTeams`),
        ...require(`${root}${queries}nearTeams`),
        ...require(`${root}${queries}nearMatches`),
        ...require(`${root}${queries}listTeamChats`),
        ...require(`${root}${queries}teamMemberRequests`),
        ...require(`${root}${queries}teamRequests`),
        ...require(`${root}${queries}listTeamMembers`)
    },

    mutations: {
        ...require(`${root}${mutations}addUser`),
        ...require(`${root}${mutations}updateUser`),
        ...require(`${root}${mutations}addMatch`),
        ...require(`${root}${mutations}addMatchPatch`),
        ...require(`${root}${mutations}addTeamMember`),
        ...require(`${root}${mutations}addTeam`),
        ...require(`${root}${mutations}updateTeamMember`),
        ...require(`${root}${mutations}addTeamChat`)
    }
}
