export const updateMatch = `
    mutation updateMatch(
        $teamId1: String!,
        $teamId2: String!,
        $patches: String!,
        $positions: [String]!,
        $schedule: String!,
        $reqStat: String!,
        $genderFilter: [String]!,
        $ageMinFilter: Int!,
        $ageMaxFilter: Int!,
        $matchFilter: [String]!,
        $stadiumGeohash: String!,
        $stadiumId: String!,
        $courtId: Int!
    ) {
        updateMatch(
            teamId1: $teamId1,
            teamId2: $teamId2,
            patches: $patches,
            positions: $positions,
            schedule: $schedule,
            reqStat: $reqStat,
            genderFilter: $genderFilter,
            ageMinFilter: $ageMinFilter,
            ageMaxFilter: $ageMaxFilter,
            matchFilter: $matchFilter,
            stadiumGeohash: $stadiumGeohash,
            stadiumId: $stadiumId,
            courtId: $courtId
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
