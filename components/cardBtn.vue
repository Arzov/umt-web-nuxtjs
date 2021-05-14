<template>
    <div :class="`cardBtn ${active ? 'active' : ''}`" @click="toggle">
        <img
            v-if="!iconCustomizable"
            :src="active ? getIcon(icon.active) : getIcon(icon.normal)"
        />
        <img v-else :src="getImage(iconAssets)" />
        <div class="content">
            <h2 class="title">
                {{ title }}
            </h2>
            {{ desc }}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        icon: {
            type: Object,
            default: () => {
                return { normal: '', active: '' }
            }
        },
        title: { type: String, default: '' },
        desc: { type: String, default: '' },
        active: { type: Boolean, default: false },
        value: { type: String, default: null },
        iconAssets: { type: String, default: "" },
        iconCustomizable: { type: Boolean, default: false },
    },
    methods: {
        toggle() {
            this.$emit("change", this.value);
        },
        getImage(image) {
            const mode =
                this._globalState.themePreference === "light" ? "lm" : "dm";
            return require(`@/assets/icons/${mode}-${image}`);
        },
    },
};
</script>
