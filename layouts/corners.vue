<template>
    <div
        :class="_globalState.themePreference === 'light' ? 'lmBody' : 'dmBody'"
    >
        <div class="header">
            <ThemeToggle />
            <img
                class="cornerTopRight"
                src="../assets/images/corner-top-right.svg"
            />
        </div>
        <Nuxt class="page" />
        <div class="footer">
            <img
                class="cornerBottomLeft"
                src="../assets/images/corner-bottom-left.svg"
            />
        </div>
    </div>
</template>
