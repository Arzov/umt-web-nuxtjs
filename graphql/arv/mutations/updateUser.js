export const updateUser = `
    mutation updateUser(
        $email: String!,
        $firstName: String!,
        $lastName: String!,
        $providerId: String!,
        $providers: [String]!,
        $joinedOn: String!,
        $verified: Boolean!,
        $birthdate: String!,
        $gender: String!,
        $picture: String!
    ) {
        updateUser(
            email: $email,
            firstName: $firstName,
            lastName: $lastName,
            providerId: $providerId,
            providers: $providers,
            joinedOn: $joinedOn,
            verified: $verified,
            birthdate: $birthdate,
            gender: $gender,
            picture: $picture
        ) {
            email
        }
    }
`
