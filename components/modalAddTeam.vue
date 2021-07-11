<template>

    <umt-modal @click="onClick">

        <center>

            <umt-avatar
                class="team-picture"
                icon="team-profile"
                color="violet"
                size="large"
            />

            <br>

            <h2>Agrega un equipo</h2>

            <p>
                Crea tu equipo para invitar a tus amigos.
            </p>

        </center>

        <br>

        <umt-input
            v-model="teamName"
            placeholder="Ingresa el nombre del equipo"
            style="width: 100%;"
        />

        <umt-button @click="createTeam">
            CREAR
        </umt-button>

        <umt-top-progress ref="topProgress" />

    </umt-modal>

</template>


<script>
export default {

    data () {
        return {
            teamName: ''
        }
    },


    methods: {

        onClick () {
            this.$emit('close')
        },

        createTeam () {

            this.handleTopProgress('start')

            // TODO: complete picture logic
            this.$store.dispatch('teams/createTeam', { name: this.teamName.toUpperCase(), picture: '' })
                .then((e) => {
                    this.handleTopProgress('done')
                    this.showNotification(e.title, e.msg, e.type)
                })
                .catch((e) => {
                    this.handleTopProgress('fail')
                    this.showNotification(e.title, e.msg, e.type)
                })

        }

    }

}
</script>
