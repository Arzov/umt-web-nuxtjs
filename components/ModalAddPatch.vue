<template>

    <umt-modal @click="onClick">

        <center>
            <h2>Agrega un jugador</h2>
        </center>

        <br>

        <p>
            Invita a tus amigos o jugadores individuales a parchar en e partido.
        </p>

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
                <umt-avatar
                    size="large"
                    type="user"
                    :src="player.picture"
                />
            </a-col>

            <a-col>
                <h2>
                    {{ player.firstName }}
                </h2>
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
        match: { type: Object, default: () => {} }
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

            this.$store.dispatch('matches/searchPlayer', { email: this.email.toLowerCase() })
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

        async addPlayer () {

            this.handleTopProgress('start')

            try {

                const e = await this.$store.dispatch('matches/addPlayer', {
                    ...this.player,
                    teamId1 : this.match.teamId1,
                    teamId2 : this.match.teamId2,
                    expireOn: this.match.expireOn
                })

                this.handleTopProgress('done')
                this.showNotification(e.title, e.msg, e.type)

            }

            catch (e) {

                this.handleTopProgress('fail')
                this.showNotification(e.title, e.msg, e.type)

            }

        }

    }

}
</script>
