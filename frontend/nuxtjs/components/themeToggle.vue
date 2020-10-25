<template>
  <a class="themeToggle" block @click="switchTheme" />
</template>

<script>
export default {
  methods: {
    switchTheme () {
      const currentMode = document.body.getAttribute('data-theme')

      if (currentMode === 'dark') {
        document.body.setAttribute('data-theme', 'light')
        window.localStorage.setItem('theme', 'light')
      } else {
        document.body.setAttribute('data-theme', 'dark')
        window.localStorage.setItem('theme', 'dark')
      }
    }
  }
}
</script>
