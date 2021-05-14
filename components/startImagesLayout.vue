<template>
    <div class="startImagesLayout">
        <img
            :src="
                _globalState.themePreference === 'light'
                    ? require('../static/lm-logo.svg')
                    : require('../static/dm-logo.svg')
            "
            class="logo"
        >

        <br>

        <img class="footballShoes" src="@/assets/images/football-shoes.svg">

        <br>

        <img
            :src="
                _globalState.themePreference === 'light'
                    ? require('@/assets/images/lm-points.svg')
                    : require('@/assets/images/dm-points.svg')
            "
            class="points"
        >
    </div>
</template>
