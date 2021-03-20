<template>
  <div class="principalTeamSelector">
    <label>
      <h4>{{ label }}</h4>
    </label>
    <a-row type="flex" class="teams">
      <img
        :src="_themePreference === 'light' ? require('../assets/icons/lm-team-profile.svg') :
          require('../assets/icons/dm-team-profile.svg')"
      >
      <img
        :src="_themePreference === 'light' ? require('../assets/icons/lm-team-profile.svg') :
          require('../assets/icons/dm-team-profile.svg')"
      >
      <img
        :src="_themePreference === 'light' ? require('../assets/icons/lm-team-profile.svg') :
          require('../assets/icons/dm-team-profile.svg')"
      >
    </a-row>
  </div>
</template>

<script>
export default {
  props: {
    label: { type: String, default: 'Selecciona' },
    teams: { type: Array, default: () => {} }
  }
}
</script>
