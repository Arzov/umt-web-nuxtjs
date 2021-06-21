<template>

    <a class="theme-toggle" @click="switchTheme">
        <img :src="require(`@/assets/icons/${_themePrefix}-theme.svg`)">
    </a>

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
