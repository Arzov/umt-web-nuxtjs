<template>
    <div
        :class="_globalState.themePreference === 'light' ? 'lmBody' : 'dmBody'"
    >
        <Navbar />
        <Nuxt class="page" />
    </div>
</template>
