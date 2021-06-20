export const matchRequests = `
    query matchRequests(
        $id: String!,
        $nextToken: String
    ) {
        matchRequests(
            id: $id,
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
