<template>
    <div :class="_themePreference === 'light' ? 'lmBody' : 'dmBody'">
        <div class="header">
            <ThemeToggle />
        </div>
        <Nuxt class="page" />
    </div>
</template>
