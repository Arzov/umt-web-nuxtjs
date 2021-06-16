export const updateMatchPatch = `
    mutation updateMatchPatch(
        $teamId1: String!,
        $teamId2: String!,
        $email: String!,
        $name: String!,
        $reqStat: String!
    ) {
        updateMatchPatch(
            teamId1: $teamId1,
            teamId2: $teamId2,
            email: $email,
            name: $name,
            reqStat: $reqStat
        ) {
            teamId1
            teamId2
            email
            name
            reqStat
            joinedOn
            expireOn
        }
    }
`
