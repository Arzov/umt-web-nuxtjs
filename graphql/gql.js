export const arv = {
    mutations: {
        updateUser: `
          mutation updateUser(
            $email: String!,
            $firstName: String!,
            $lastName: String!,
            $providerId: String!,
            $providers: [String]!,
            $registerDate: String!,
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
              registerDate: $registerDate,
              verified: $verified,
              birthdate: $birthdate,
              gender: $gender,
              picture: $picture
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
              providerId,
              providers,
              registerDate,
              verified,
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
        getTeam: `
          query getTeam($id: String!) {
            getTeam(id: $id) {
              id
              name
              picture
              formation
              geohash
              coords
              searchingPlayers
              genderFilter
              ageMinFilter
              ageMaxFilter
              matchFilter
            }
          }
        `,
        listTeams: `
          query listTeams($email: String!, $nextToken: String) {
            listTeams(email: $email, nextToken: $nextToken) {
              items {
                id
                name
                picture
                formation
                geohash
                coords
                searchingPlayers
                genderFilter
                ageMinFilter
                ageMaxFilter
                matchFilter
              }
              nextToken
            }
          }
        `,
        nearTeams: `
          query nearTeams(
            $ownTeams: [String],
            $geohash: String!,
            $forJoin: Boolean!,
            $gender: String!,
            $genderFilter: [String]!,
            $ageMinFilter: Int!,
            $ageMaxFilter: Int!,
            $matchFilter: [String]!,
            $nextToken: String
          ) {
            nearTeams(
              ownTeams: $ownTeams,
              geohash: $geohash,
              forJoin: $forJoin,
              gender: $gender,
              genderFilter: $genderFilter,
              ageMinFilter: $ageMinFilter,
              ageMaxFilter: $ageMaxFilter,
              matchFilter: $matchFilter,
              nextToken: $nextToken
            ) {
              items {
                id
                name
                picture
                formation
                geohash
                coords
                searchingPlayers
                genderFilter
                ageMinFilter
                ageMaxFilter
                matchFilter
              }
              nextToken
            }
          }
        `,
        nearMatches: `
          query nearMatches(
            $geohash: String!,
            $ownTeams: [String],
            $gender: String!,
            $ageMinFilter: Int!,
            $ageMaxFilter: Int!,
            $matchFilter: [String]!,
            $nextToken: String
          ) {
            nearMatches(
              geohash: $geohash,
              ownTeams: $ownTeams,
              gender: $gender,
              ageMinFilter: $ageMinFilter,
              ageMaxFilter: $ageMaxFilter,
              matchFilter: $matchFilter,
              nextToken: $nextToken
            ) {
              items {
                teamId1
                teamId2
                createdOn
                allowedPatches
                positions
                expireOn
                schedule
                reqStat
                geohash
                coords
                genderFilter
                ageMinFilter
                ageMaxFilter
                matchFilter
                stadiumGeohash
                stadiumId
                courtId
              }
              nextToken
            }
          }
        `
    },
    mutations: {
        addUser: `
          mutation addUser(
            $latitude: Float!,
            $longitude: Float!,
            $email: String!,
            $ageMinFilter: Int!,
            $ageMaxFilter: Int!,
            $matchFilter: [String!]!,
            $positions: [String],
            $skills: String,
            $foot: String!,
            $weight: Int!,
            $height: Int!
          ) {
            addUser(
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
              email,
              geohash,
              coords,
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
        updateUser: `
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
              email,
              geohash,
              coords,
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
