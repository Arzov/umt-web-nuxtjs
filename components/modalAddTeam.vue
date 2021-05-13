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
                Agrega un equipo
            </h1>
        </center>
        <br>
        <h2 style="color: white">
            Crear equipo
        </h2>
        <br>
        <a-row style="display: flex">
            <PrincipalInput
                v-model="teamName"
                placeholder="Ingresa el nombre del equipo"
            />
        </a-row>
        <br>
        <a-row>
            <PrincipalBtn
                text="CREAR"
                :loading="btnLoading"
                @click.native="createTeam()"
            />
        </a-row>
    </a-modal>
</template>

<script>
export default {
    props: {
        value: { type: Boolean, required: true }
    },

    data () {
        return {
            teamName: null,
            showAddTeam: false,
            showAddPlayer: false
        }
    },

    methods: {
        onCancel () {
            this.$emit('input', false)
            this.$emit('change', false)
        },

        createTeam () {
            this.btnLoading = true

            // TODO: complete picture logic
            this.$store
                .dispatch('teams/createTeam', { name: this.teamName, picture: '' })
                .then((e) => {
                    this.showNotification(e.title, e.msg, e.type)
                    this.btnLoading = false
                })
                .catch((e) => {
                    this.showNotification(e.title, e.msg, e.type)
                    this.btnLoading = false
                })
        }
    }
}
</script>
