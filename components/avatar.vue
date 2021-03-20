<template>
  <div class="avatar">
    <a-row type="flex">
      <div class="img">
        <img :src="require('../assets/images/franco_profile_bw_512x512.jpg')">
      </div>
      <a-col>
        <label>
          <h3 class="name">{{ label }}</h3>
        </label>
        <nuxt-link to="">
          <i class="teams">{{ nameTeam | uppercase }}</i>
        </nuxt-link>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
    props: {
        nameTeam: { type: String, default: 'Team' },
        label: { type: String, default: 'Usuario' }
    }
}
</script>
