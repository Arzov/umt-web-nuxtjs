export const nearMatches = `
    query nearMatches(
        $email: String!,
        $geohash: String!,
        $ownTeams: [String],
        $gender: String!,
        $age: Int!,
        $ageMinFilter: Int!,
        $ageMaxFilter: Int!,
        $matchFilter: [String]!,
        $nextToken: String
    ) {
        nearMatches(
            email: $email,
            geohash: $geohash,
            ownTeams: $ownTeams,
            gender: $gender,
            age: $age,
            ageMinFilter: $ageMinFilter,
            ageMaxFilter: $ageMaxFilter,
            matchFilter: $matchFilter,
            nextToken: $nextToken
        ) {
            items {
                teamId1
                teamId2
                createdOn
                patches
                positions
                expireOn
                schedule
                reqStat
                geohash
                coords
                genderFilter
                ageMinFilter
                ageMaxFilter
                matchFilter
                stadiumGeohash
                stadiumId
                courtId
            }
            nextToken
        }
    }
`
