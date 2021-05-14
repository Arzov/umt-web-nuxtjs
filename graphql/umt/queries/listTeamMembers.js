export const listTeamMembers = `
    query listTeamMembers($teamId: String!, $nextToken: String) {
        listTeamMembers(teamId: $teamId, nextToken: $nextToken) {
            items {
                teamId
                email
                name
                position
                role
                reqStat
                number
                joinedOn
            }
            nextToken
        }
    }
`
