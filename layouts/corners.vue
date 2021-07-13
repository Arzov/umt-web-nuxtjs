<template>

    <umt-theme-provider :theme="_globalState.themePreference">

        <div class="header">
            <theme-toggle />
            <img class="corner-top-right" src="@/assets/images/corner-top-right.svg">
        </div>

        <Nuxt class="page" />

        <umt-notification
            v-if="_globalState.notificationStatus"
            :type="_globalState.notificationType"
            :title="_globalState.notificationTitle"
            :msg="_globalState.notificationMsg"
            @click="$store.dispatch('global/setState', { notificationStatus: false })"
        />

    </umt-theme-provider>

</template>
