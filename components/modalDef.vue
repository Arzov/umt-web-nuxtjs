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
        <div v-if="_globalState.themePreference === 'light'">
            <center>
                <h1 style="color: black">{{ title }}</h1>
                <br />
                <h2 style="color: black">
                    {{ desc }}
                </h2>
            </center>
        </div>

        <div v-else>
            <center>
                <h1 style="color: white">{{ title }}</h1>
                <br />
                <h2 style="color: white">
                    {{ desc }}
                </h2>
            </center>
        </div>

        <br />
        <div>
            <slot> </slot>
        </div>
    </a-modal>
</template>

<script>
export default {
    props: {
        value: { type: Boolean, required: true },
        title: { type: String, default: "Title" },
        desc: { type: String, default: "Description" },
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
