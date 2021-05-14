export const addMatch = `
    mutation addMatch(
        $teamId1: String!,
        $teamId2: String!,
        $matchFilter: [String!]!,
        $genderFilter: [String!]!,
        $ageMinFilter: Int!,
        $ageMaxFilter: Int!,
        $geohash: String!,
        $latitude: Float!,
        $longitude: Float!
    ) {
        addMatch(
            teamId1: $teamId1,
            teamId2: $teamId2,
            matchFilter: $matchFilter,
            genderFilter: $genderFilter,
            ageMinFilter: $ageMinFilter,
            ageMaxFilter: $ageMaxFilter,
            geohash: $geohash,
            latitude: $latitude,
            longitude: $longitude
        ) {
            teamId1
            teamId2
            createdOn
            expireOn
            patches
            positions
            ageMinFilter
            ageMaxFilter
            matchFilter
            schedule
            reqStat
            geohash
            coords
            stadiumGeohash
            stadiumId
            courtId
            genderFilter
        }
    }
`
