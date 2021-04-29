export const addTeamMember = `
    mutation addTeamMember(
        $teamId: String!,
        $email: String!,
        $name: String!,
        $role: [String],
        $reqStat: String!
    ) {
        addTeamMember(
            teamId: $teamId,
            email: $email,
            name: $name,
            role: $role,
            reqStat: $reqStat
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
