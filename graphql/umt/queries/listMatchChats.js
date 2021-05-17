export const listMatchChats = `
    query listMatchChats(
        $teamId1: String!,
        $teamId2: String!,
        $nextToken: String
    ) {
        listMatchChats(
            teamId1: $teamId1,
            teamId2: $teamId2,
            nextToken: $nextToken
        ) {
            items {
                teamId1
                teamId2
                email
                sentOn
                expireOn
                author
                msg
            }
            nextToken
        }
    }
`
