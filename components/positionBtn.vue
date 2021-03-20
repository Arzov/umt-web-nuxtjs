<template>
  <a-button :class="`positionBtn${color}${stat}`" @click="toggle">
    <b>{{ text }}</b>
  </a-button>
</template>

<script>
export default {
    props: {
        text: { type: String, default: '' },
        color: { type: String, default: '' },
        status: { type: String, default: '' },
        value: { type: String, default: null }
    },
    data () {
        return {
            stat: this.status
        }
    },
    methods: {
        toggle () {
            if (this.stat === '') {
                this.stat = 'On'
                this.$emit('change', { key: this.value, value: this.value })
            } else {
                this.stat = ''
                this.$emit('change', { key: this.value, value: null })
            }
        }
    }
}
</script>
