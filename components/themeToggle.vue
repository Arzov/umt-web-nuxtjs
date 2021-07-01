<template>

    <umt-button
        class="theme-toggle"
        type="icon"
        color="transparent"
        :size="size"
        :icon="`${_themePrefix}-theme`"
        @click="switchTheme"
    />

</template>


<script>

export default {

    props: {
        size: {
            type    : String,
            default : 'large'
        }
    },

    methods: {
        switchTheme () {
            this.$store.dispatch('global/setTheme')
        }
    }

}

</script>
