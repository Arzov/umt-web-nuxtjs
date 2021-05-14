export const getUser = `
    query getUser($email: String!) {
        getUser(email: $email) {
            email
            firstName
            lastName
            providerId
            providers
            joinedOn
            verified
            birthdate
            gender
            picture
        }
    }
`
