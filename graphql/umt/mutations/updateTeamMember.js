export const updateTeamMember = `
    mutation updateTeamMember(
        $teamId: String!,
        $email: String!,
        $name: String!,
        $position: String!,
        $role: [String]!,
        $reqStat: String!,
        $number: Int!
    ) {
        updateTeamMember(
            teamId: $teamId,
            email: $email,
            name: $name,
            position: $position,
            role: $role,
            reqStat: $reqStat,
            number: $number
        ) {
            teamId
            email
            name
            position
            role
            reqStat
            number
            joinedOn
        }
    }
`
