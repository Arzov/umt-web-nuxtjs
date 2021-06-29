<template>

    <umt-button class="theme-toggle" type="icon" color="transparent" :icon="`${_themePrefix}-theme`" @click="switchTheme" />

</template>


<script>

export default {

    methods: {
        switchTheme () {
            this.$store.dispatch('global/setTheme')
        }
    }

}

</script>
