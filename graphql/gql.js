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
    `,
    listTeams: `
      query listTeams($email: String!, $nextToken: String) {
        listTeams(email: $email, nextToken: $nextToken) {
          items {
            id
          }
          nextToken
        }
      }
    `,
    getTeam: `
      query getTeam($id: String!) {
        getTeam(id: $id) {
          id
          name
          picture
          formation
          geohash
          searchingPlayers
        }
      }
    `
  },
  mutations: {
    addUser: `
      mutation addUser($latitude: Float!, $longitude: Float!, $email: String!, $genderFilter: [String!]!,
      $ageMinFilter: Int!, $ageMaxFilter: Int!, $matchFilter: [String!]!, $positions: [String],
      $skills: String, $foot: String!, $weight: Int!, $height: Int!) {
        addUser(latitude: $latitude, longitude: $longitude, email: $email, genderFilter: $genderFilter,
          ageMinFilter: $ageMinFilter, ageMaxFilter: $ageMaxFilter, matchFilter: $matchFilter,
          positions: $positions, skills: $skills, foot: $foot, weight: $weight, height: $height) {
          email,
          geohash,
          coords,
          ageMinFilter,
          ageMaxFilter,
          genderFilter,
          matchFilter,
          positions,
          skills,
          foot,
          weight,
          height
        }
      }
    `,
    updateUser: `
      mutation updateUser($latitude: Float!, $longitude: Float!, $email: String!, $genderFilter: [String]!,
      $ageMinFilter: Int!, $ageMaxFilter: Int!, $matchFilter: [String]!, $positions: [String]!,
      $skills: String!, $foot: String!, $weight: Int!, $height: Int!) {
        updateUser(latitude: $latitude, longitude: $longitude, email: $email, genderFilter: $genderFilter,
          ageMinFilter: $ageMinFilter, ageMaxFilter: $ageMaxFilter, matchFilter: $matchFilter,
          positions: $positions, skills: $skills, foot: $foot, weight: $weight, height: $height) {
          email,
          geohash,
          coords,
          ageMinFilter,
          ageMaxFilter,
          genderFilter,
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
