<template>

    <umt-theme-provider :theme="_globalState.themePreference">

        <div class="header">
            <theme-toggle />
            <img class="corner-top-right" src="@/assets/images/corner-top-right.svg">
        </div>

        <Nuxt class="page" />

    </umt-theme-provider>

</template>
