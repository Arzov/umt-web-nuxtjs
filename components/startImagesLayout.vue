<template>
    <div class="startImagesLayout">
        <img
            :src="
                _globalState.themePreference === 'light'
                    ? require('../static/lm-logo.svg')
                    : require('../static/dm-logo.svg')
            "
            class="logo"
        />
        <img class="footballShoes" src="../assets/images/football-shoes.svg" />
        <img
            :src="
                _globalState.themePreference === 'light'
                    ? require('../assets/images/lm-points.svg')
                    : require('../assets/images/dm-points.svg')
            "
            class="points"
        />
    </div>
</template>
