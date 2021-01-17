<template>
  <div :class="_themePreference === 'light' ? 'lmBody' : 'dmBody'">
    <div class="header">
      <ThemeToggle />
    </div>
    <img class="cornerTopRight" src="../assets/images/corner-top-right.svg">
    <img class="cornerBottomLeft" src="../assets/images/corner-bottom-left.svg">
    <Nuxt class="page" />
  </div>
</template>
