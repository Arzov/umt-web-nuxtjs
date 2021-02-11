<template>
  <div :class="_themePreference === 'light' ? 'lmBody' : 'dmBody'">
    <Navbar />
    <Nuxt class="page" />
  </div>
</template>
