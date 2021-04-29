export const teamRequests = `
    query teamRequests(
        $id: String!,
        $nextToken: String
    ) {
        teamRequests(
            id: $id,
            nextToken: $nextToken
        ) {
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
