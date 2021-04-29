export const teamMemberRequests = `
    query teamMemberRequests(
        $email: String!,
        $nextToken: String
    ) {
        teamMemberRequests(
            email: $email,
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
