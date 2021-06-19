export const listMatchPatches = `
    query listMatchPatches(
        $teamId1: String!,
        $teamId2: String!,
        $nextToken: String
    ) {
        listMatchPatches(
            teamId1: $teamId1,
            teamId2: $teamId2,
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
