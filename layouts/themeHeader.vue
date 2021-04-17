<template>
    <div
        :class="_globalState.themePreference === 'light' ? 'lmBody' : 'dmBody'"
    >
        <div class="header">
            <ThemeToggle />
        </div>
        <Nuxt class="page" />
    </div>
</template>
