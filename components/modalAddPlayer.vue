<template>

    <umt-modal @click="onClick">

        <center>

            <h2>Agrega un jugador</h2>

            <br>

            <p>
                Invita a tus amigos o jugadores individuales a ser parte de tu
                equipo.
            </p>

        </center>

        <br>

        <umt-input
            v-model="email"
            type="search"
            placeholder="Ingresa el email del jugador"
            style="width: 100%;"
            @search="searchPlayer"
        />

        <a-row
            v-if="playerFound == 'y'"
            type="flex"
            justify="space-around"
            align="middle"
            style="width: 100%;"
        >

            <a-col>
                <umt-avatar size="large" type="user" :src="player.picture" />
            </a-col>

            <a-col>
                <h2>{{ player.firstName }}</h2>
            </a-col>

            <a-col>
                <umt-button
                    shape="round"
                    type="border"
                    size="small"
                    style="margin: 0;"
                    @click="addPlayer"
                >
                    SOLICITAR
                </umt-button>
            </a-col>

        </a-row>

        <a-row v-if="playerFound == 'n'">
            <p>¡Jugador no encontrado!</p>
        </a-row>

        <umt-top-progress ref="topProgress" />

    </umt-modal>

</template>


<script>
export default {

    props: {
        teamId  : { type: String, required: true }
    },


    data () {
        return {
            email       : '',
            playerFound : '',
            player      : {}
        }
    },


    methods: {

        onClick () {
            this.$emit('close')
        },

        searchPlayer () {

            this.handleTopProgress('start')

            this.$store.dispatch('teams/searchPlayer', { email: this.email.toLowerCase() })
                .then((e) => {
                    this.handleTopProgress('done')
                    this.playerFound = e.email ? 'y' : 'n'
                    this.player = e
                })
                .catch((e) => {
                    this.handleTopProgress('fail')
                    this.showNotification(e.title, e.msg, e.type)
                })

        },

        addPlayer () {

            this.handleTopProgress('start')

            this.$store.dispatch('teams/addPlayer', {
                ...this.player,
                teamId: this.teamId
            })
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
