export const addTeamChat = `
    mutation addTeamChat(
        $teamId: String!,
        $email: String!,
        $author: String!,
        $msg: String!
    ) {
        addTeamChat(
            teamId: $teamId,
            email: $email,
            author: $author,
            msg: $msg
        ) {
            teamId
            email
            sentOn
            expireOn
            author
            msg
        }
    }
`
