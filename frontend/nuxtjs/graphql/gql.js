export const arv = {
  mutations: {
    updateUser: `
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
  },
  queries: {
    getUser: `
      query getUser($email: String!) {
        getUser(email: $email) {
          email,
          firstName,
          lastName,
          birthdate,
          gender,
          picture
        }
      }
    `
  }
}

export const umt = {
  queries: {
    getUser: `
      query getUser($email: String!) {
        getUser(email: $email) {
          email,
          geohash,
          coords,
          genderFilter,
          ageMinFilter,
          ageMaxFilter,
          matchFilter,
          positions,
          skills,
          foot,
          weight,
          height
        }
      }
    `
  }
}
