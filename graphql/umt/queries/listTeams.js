export const listTeams = `
    query listTeams($email: String!, $nextToken: String) {
        listTeams(email: $email, nextToken: $nextToken) {
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
