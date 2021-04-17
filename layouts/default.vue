<template>
    <div
        :class="_globalState.themePreference === 'light' ? 'lmBody' : 'dmBody'"
    >
        <Nuxt class="page" />
    </div>
</template>
