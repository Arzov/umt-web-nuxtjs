export const getTeam = `
    query getTeam($id: String!) {
        getTeam(id: $id) {
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
    }
`
