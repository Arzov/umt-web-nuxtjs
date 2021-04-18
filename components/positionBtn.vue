<template>
    <a-button :class="`positionBtn${color} ${stat}`" @click="toggle">
        <b>{{ text }}</b>
    </a-button>
</template>

<script>
export default {
    props: {
        text: { type: String, default: "" },
        color: { type: String, default: "" },
        status: { type: String, default: "off" },
        value: { type: String, default: null },
    },

    data() {
        return {
            stat: this.status,
        };
    },

    methods: {
        toggle() {
            if (this.stat === "off") {
                this.stat = "on";
                this.$emit("change", { key: this.value, value: this.value });
            } else {
                this.stat = "off";
                this.$emit("change", { key: this.value, value: null });
            }
        },
    },
};
</script>
