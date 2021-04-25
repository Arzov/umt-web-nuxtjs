<template>
    <div v-if="teams" class="primaryTeamSelector">
        <label>
            <h4>{{ label }}</h4>
        </label>

        <a-row type="flex" :gutter="16">
            <a-col v-for="team in teams" :key="`t${team.id}`">
                <a-avatar
                    :class="isTeamSelected(team) ? 'selected' : ''"
                    :src="
                        team.picture !== ''
                            ? team.picture
                            : getIcon('team-profile.svg')
                    "
                    size="large"
                    @click="triggerClick(team)"
                />
            </a-col>
        </a-row>

        <br>

        <center>
            * Tu equipo principal es con el cual desafiarás a otros equipos
            rivales.
        </center>
    </div>
</template>

<script>
export default {
    props: {
        label: { type: String, default: 'EQUIPO PRINCIPAL*' },
        primaryTeam: { type: Object, default: () => {} },
        teams: { type: Array, default: () => [] }
    },
    methods: {
        isTeamSelected (team) {
            if (this.primaryTeam) {
                return team.id === this.primaryTeam.id
            }
            else {
                return false
            }
        },
        triggerClick (team) {
            this.$emit('click', team)
        }
    }
}
</script>
