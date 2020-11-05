<template>
  <div>
    <Nuxt v-if="_themePreference === 'light'" class="lmBody" />
    <Nuxt v-else class="dmBody" />
  </div>
</template>
