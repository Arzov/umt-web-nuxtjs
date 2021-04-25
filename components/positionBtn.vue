<template>
    <a-tooltip placement="bottom">
        <template slot="title">
            <span>{{ label }}</span>
        </template>
        <a-button :class="`positionBtn${color} ${stat}`" @click="toggle">
            <b>{{ text }}</b>
        </a-button>
    </a-tooltip>
</template>

<script>
export default {
    props: {
        label: { type: String, default: '' },
        text: { type: String, default: '' },
        color: { type: String, default: '' },
        status: { type: String, default: 'off' },
        value: { type: String, required: true }
    },

    data () {
        return {
            stat: this.status
        }
    },

    methods: {
        toggle () {
            if (this.stat === 'off') {
                this.stat = 'on'
                this.$emit('change', { key: this.value, value: this.value })
            }
            else {
                this.stat = 'off'
                this.$emit('change', { key: this.value, value: null })
            }
        }
    }
}
</script>
