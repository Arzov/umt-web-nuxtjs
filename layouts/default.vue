<template>

    <umt-theme-provider :theme="_globalState.themePreference">

        <NuxtChild class="page" />


        <umt-notification
            v-if="_globalState.notificationStatus"
            :type="_globalState.notificationType"
            :title="_globalState.notificationTitle"
            :msg="_globalState.notificationMsg"
            @click="$store.dispatch('global/setState', { notificationStatus: false })"
        />

    </umt-theme-provider>

</template>
