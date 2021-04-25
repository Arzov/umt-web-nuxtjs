<template>
    <a class="themeToggle" block @click="switchTheme">
        <img
            :src="
                _globalState.themePreference === 'light'
                    ? require('../assets/icons/lm-theme.svg')
                    : require('../assets/icons/dm-theme.svg')
            "
        >
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
