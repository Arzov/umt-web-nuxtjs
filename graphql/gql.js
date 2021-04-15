export const arv = {
    mutations: {
        updateUser: `
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
        `,
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
              joinedOn,
              verified,
              birthdate,
              gender,
              picture
            }
          }
        `,
    },
};

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
            $email: String!,
            $ownTeams: [String],
            $geohash: String!,
            $forJoin: Boolean!,
            $gender: String!,
            $age: Int!,
            $genderFilter: [String]!,
            $ageMinFilter: Int!,
            $ageMaxFilter: Int!,
            $matchFilter: [String]!,
            $nextToken: String
          ) {
            nearTeams(
              email: $email,
              ownTeams: $ownTeams,
              geohash: $geohash,
              forJoin: $forJoin,
              gender: $gender,
              age: $age,
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
            $email: String!,
            $geohash: String!,
            $ownTeams: [String],
            $gender: String!,
            $age: Int!,
            $ageMinFilter: Int!,
            $ageMaxFilter: Int!,
            $matchFilter: [String]!,
            $nextToken: String
          ) {
            nearMatches(
              email: $email,
              geohash: $geohash,
              ownTeams: $ownTeams,
              gender: $gender,
              age: $age,
              ageMinFilter: $ageMinFilter,
              ageMaxFilter: $ageMaxFilter,
              matchFilter: $matchFilter,
              nextToken: $nextToken
            ) {
              items {
                teamId1
                teamId2
                createdOn
                patches
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
        `,
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
        `,
        addMatch: `
          mutation addMatch(
            $teamId1: String!,
            $teamId2: String!,
            $matchFilter: [String!]!,
            $genderFilter: [String!]!,
            $ageMinFilter: Int!,
            $ageMaxFilter: Int!,
            $geohash: String!,
            $latitude: Float!,
            $longitude: Float!
          ) {
            addMatch(
              teamId1: $teamId1,
              teamId2: $teamId2,
              matchFilter: $matchFilter,
              genderFilter: $genderFilter,
              ageMinFilter: $ageMinFilter,
              ageMaxFilter: $ageMaxFilter,
              geohash: $geohash,
              latitude: $latitude,
              longitude: $longitude
            ) {
              teamId1,
              teamId2,
              createdOn,
              expireOn,
              patches,
              positions,
              ageMinFilter,
              ageMaxFilter,
              matchFilter,
              schedule,
              reqStat,
              geohash,
              coords,
              stadiumGeohash,
              stadiumId,
              courtId,
              genderFilter
            }
          }
        `,
        addMatchPatch: `
          mutation addMatchPatch(
            $teamId1: String!,
            $teamId2: String!,
            $email: String!,
            $reqStat: String,
            $expireOn: String!
          ) {
            addMatchPatch(
              teamId1: $teamId1,
              teamId2: $teamId2,
              email: $email,
              reqStat: $reqStat,
              expireOn: $expireOn
            ) {
              teamId1,
              teamId2,
              email,
              reqStat,
              joinedOn,
              expireOn
            }
          }
        `,
        addTeamMember: `
          mutation addTeamMember(
            $teamId: String!,
            $email: String!,
            $role: [String],
            $reqStat: String!
          ) {
            addTeamMember(
              teamId: $teamId,
              email: $email,
              role: $role,
              reqStat: $reqStat
            ) {
              teamId,
              email,
              position,
              role,
              reqStat,
              number,
              joinedOn
            }
          }
        `,
    },
};
