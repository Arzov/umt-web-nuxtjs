export const addTeam = `
    mutation addTeam(
        $name: String!,
        $geohash: String!,
        $latitude: Float!,
        $longitude: Float!,
        $picture: String!,
        $genderFilter: [String!]!,
        $ageMinFilter: Int!,
        $ageMaxFilter: Int!,
        $matchFilter: [String!]!,
    ) {
        addTeam(
            name: $name,
            geohash: $geohash,
            latitude: $latitude,
            longitude: $longitude,
            picture: $picture,
            genderFilter: $genderFilter,
            ageMinFilter: $ageMinFilter,
            ageMaxFilter: $ageMaxFilter,
            matchFilter: $matchFilter,
        ) {
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
