export const addTeamMember = `
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
            teamId
            email
            position
            role
            reqStat
            number
            joinedOn
        }
    }
`
