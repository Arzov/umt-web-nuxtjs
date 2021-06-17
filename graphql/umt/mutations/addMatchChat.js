export const addMatchChat = `
    mutation addMatchChat(
        $teamId1: String!,
        $teamId2: String!,
        $email: String!,
        $author: String!,
        $msg: String!,
        $expireOn: String!
    ) {
        addMatchChat(
            teamId1: $teamId1,
            teamId2: $teamId2,
            email: $email,
            author: $author,
            msg: $msg,
            expireOn: $expireOn
        ) {
            teamId1
            teamId2
            email
            sentOn
            author
            msg
            expireOn
        }
    }
`
