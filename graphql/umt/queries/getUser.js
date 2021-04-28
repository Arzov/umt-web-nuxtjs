export const getUser = `
    query getUser($email: String!) {
        getUser(email: $email) {
            email
            geohash
            coords
            ageMinFilter
            ageMaxFilter
            matchFilter
            positions
            skills
            foot
            weight
            height
        }
    }
`
