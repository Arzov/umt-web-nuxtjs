export const updateUser = `
  mutation updateUser(
    $email: String!
    $firstName: String!
    $lastName: String!
    $picture: String!
    $birthdate: String!
    $gender: String!
  ) {
    updateUser(
      email: $email
      firstName: $firstName
      lastName: $lastName
      picture: $picture
      birthdate: $birthdate
      gender: $gender
    ) {
      email
    }
  }
`
