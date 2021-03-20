<template>
  <div :class="_themePreference === 'light' ? 'lmBody' : 'dmBody'">
    <Nuxt class="page" />
  </div>
</template>
