export const matchPatchRequests = `
    query matchPatchRequests(
        $email: String!,
        $nextToken: String
    ) {
        matchPatchRequests(
            email: $email,
            nextToken: $nextToken
        ) {
            items {
                teamId1
                teamId2
                email
                name
                reqStat
                joinedOn
                expireOn
            }
            nextToken
        }
    }
`
