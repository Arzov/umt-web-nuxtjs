export const listTeamChats = `
    query listTeamChats(
        $id: String!,
        $nextToken: String
    ) {
        listTeamChats(
            id: $id,
            nextToken: $nextToken
        ) {
            items {
                teamId
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
