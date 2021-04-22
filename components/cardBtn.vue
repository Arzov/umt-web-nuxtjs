<template>
    <div :class="`cardBtn ${active ? 'active' : ''}`" @click="toggle">
        <img :src="active ? getIcon(icon.active) : getIcon(icon.normal)" />
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
                return { normal: "", active: "" };
            },
        },
        title: { type: String, default: "" },
        desc: { type: String, default: "" },
        active: { type: Boolean, default: false },
        value: { type: String, default: null },
    },
    methods: {
        toggle() {
            this.$emit("change", this.value);
        },
    },
};
</script>
