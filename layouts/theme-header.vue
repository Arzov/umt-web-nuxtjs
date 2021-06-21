<template>

    <umt-theme-provider :theme="_globalState.themePreference">

        <div class="header">
            <theme-toggle />
        </div>

        <Nuxt class="page" />

    </umt-theme-provider>

</template>
