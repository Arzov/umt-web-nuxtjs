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
            <h1 style="color: white">Agrega un jugador</h1>
        </center>
        <br />
        <h2 style="color: white">
            Invita a tus amigos o jugadores individuales a ser parte de tu
            equipo.
        </h2>
        <br />
        <a-row style="display: flex">
            <PrincipalInput
                placeholder="Ingresa el email del jugador"
                style="width: 100%"
            />
            <img
                src="@/assets/icons/dm-search.svg"
                alt=""
                style="position: absolute; right: 10px; top: 5px; width: 20px"
            />
        </a-row>
        <br />
        <a-row>
            <a-avatar size="large" :src="getImage('')" />
            <h4 style="color: white">Svenko</h4>
            <div>
                <RoundedTextBtn text="solicitar" />
            </div>
        </a-row>
    </a-modal>
</template>

<script>
export default {
    props: {
        value: { type: Boolean, required: true },
    },
    methods: {
        getImage(image) {
            if (image === "") {
                const mode =
                    this._globalState.themePreference === "light" ? "lm" : "dm";
                return require(`@/assets/icons/${mode}-avatar.svg`);
            } else {
                return image;
            }
        },
        onCancel() {
            this.$emit("input", false);
        },
    },
};
</script>
