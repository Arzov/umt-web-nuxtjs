export const addMatchPatch = `
    mutation addMatchPatch(
        $teamId1: String!,
        $teamId2: String!,
        $email: String!,
        $name: String!,
        $reqStat: String,
        $expireOn: String!
    ) {
        addMatchPatch(
            teamId1: $teamId1,
            teamId2: $teamId2,
            email: $email,
            name: $name,
            reqStat: $reqStat,
            expireOn: $expireOn
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
