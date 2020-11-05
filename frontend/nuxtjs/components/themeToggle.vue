<template>
  <a class="themeToggle" block @click="switchTheme">
    <img v-if="_themePreference === 'light'" :src="require('../assets/icons/lm-theme.svg')">
    <img v-else :src="require('../assets/icons/dm-theme.svg')">
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
