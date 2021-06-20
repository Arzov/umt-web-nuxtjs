export const getMatch = `
    query getMatch(
        $teamId1: String!,
        $teamId2: String!
    ) {
        getMatch(
            teamId1: $teamId1,
            teamId2: $teamId2
        ) {
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
    }
`
