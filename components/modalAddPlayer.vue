<template>
    <a-modal
        v-model="value"
        class="geoloc"
        centered
        :wrap-class-name="
            _globalState.themePreference === 'light' ? 'lmBody' : 'dmBody'
        "
        :mask-closable="false"
        :footer="false"
        @cancel="onCancel"
    >
        <center>
            <h1 style="color: white">
                Agrega un jugador
            </h1>
        </center>
        <br>
        <h2 style="color: white">
            Invita a tus amigos o jugadores individuales a ser parte de tu
            equipo.
        </h2>
        <br>
        <a-row style="display: flex">
            <PrincipalInput
                v-model="email"
                placeholder="Ingresa el email del jugador"
                style="width: 100%"
            />
            <!-- <img
                src="@/assets/icons/dm-search.svg"
                alt=""
                style="position: absolute; right: 10px; top: 5px; width: 20px"
                @click="searchPlayer"
            > -->
        </a-row>
        <br>
        <a-row v-if="playerFound == 'y'">
            <!-- <a-avatar size="large" :src="player.picture || getIcon('avatar.svg')" /> -->
            <h4 style="color: white">
                {{ player.firstName }}
            </h4>
            <div>
                <RoundedTextBtn text="solicitar" @click.native="addPlayer" />
            </div>
        </a-row>
        <a-row v-if="playerFound == 'n'">
            Jugador no encontrado!
        </a-row>
    </a-modal>
</template>

<script>
export default {
    props: {
        value   : { type: Boolean, required: true },
        teamId  : { type: String, required: true }
    },

    data () {
        return {
            email           : '',
            playerFound     : '',
            player          : {}
        }
    },

    methods: {
        onCancel () {
            this.$emit('input', false)
        },

        searchPlayer () {

            this.$store.dispatch('teams/searchPlayer', { email: this.email })
                .then((e) => {
                    this.playerFound = e.email ? 'y' : 'n'

                    this.player = e

                })
                .catch((e) => {
                    this.showNotification(e.title, e.msg, e.type)
                })
        },

        addPlayer () {
            this.$store.dispatch('teams/addPlayer', {
                ...this.player,
                teamId: this.teamId
            })
                .then((e) => {
                    this.showNotification(e.title, e.msg, e.type)
                })
                .catch((e) => {
                    this.showNotification(e.title, e.msg, e.type)
                })
        }
    }
}
</script>
