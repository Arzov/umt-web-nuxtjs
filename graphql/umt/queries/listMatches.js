export const listMatches = `
    query listMatches($id: String, $email: String, $nextToken: String) {
        listMatches(id: $id, email: $email, nextToken: $nextToken) {
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
