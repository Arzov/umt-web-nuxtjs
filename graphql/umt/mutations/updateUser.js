export const updateUser = `
    mutation updateUser(
        $latitude: Float!,
        $longitude: Float!,
        $email: String!,
        $ageMinFilter: Int!,
        $ageMaxFilter: Int!,
        $matchFilter: [String]!,
        $positions: [String]!,
        $skills: String!,
        $foot: String!,
        $weight: Int!,
        $height: Int!
    ) {
        updateUser(
            latitude: $latitude,
            longitude: $longitude,
            email: $email,
            ageMinFilter: $ageMinFilter,
            ageMaxFilter: $ageMaxFilter,
            matchFilter: $matchFilter,
            positions: $positions,
            skills: $skills,
            foot: $foot,
            weight: $weight,
            height: $height
        ) {
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
