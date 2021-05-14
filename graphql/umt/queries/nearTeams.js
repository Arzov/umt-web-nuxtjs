export const nearTeams = `
    query nearTeams(
        $email: String!,
        $ownTeams: [String],
        $geohash: String!,
        $forJoin: Boolean!,
        $gender: String!,
        $age: Int!,
        $genderFilter: [String]!,
        $ageMinFilter: Int!,
        $ageMaxFilter: Int!,
        $matchFilter: [String]!,
        $nextToken: String
    ) {
        nearTeams(
            email: $email,
            ownTeams: $ownTeams,
            geohash: $geohash,
            forJoin: $forJoin,
            gender: $gender,
            age: $age,
            genderFilter: $genderFilter,
            ageMinFilter: $ageMinFilter,
            ageMaxFilter: $ageMaxFilter,
            matchFilter: $matchFilter,
            nextToken: $nextToken
        ) {
            items {
                id
                name
                picture
                formation
                geohash
                coords
                genderFilter
                ageMinFilter
                ageMaxFilter
                matchFilter
            }
            nextToken
        }
    }
`
