<template>
  <div class="listBtn">
    <a-avatar size="large" :src="getImage(picture1)" />
    <a-row class="contentContainer">
      <a-col class="content" :span="18">
        <a-row class="title">
          <h2>
            {{ title }}
          </h2>
        </a-row>
        <a-row class="desc">
          {{ desc }}
        </a-row>
      </a-col>
      <a-col class="time" :span="6">
        {{ time }}
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  props: {
    picture1: { type: String, default: '' },
    title: { type: String, default: '' },
    desc: { type: String, default: '' },
    time: { type: Date, default: '' }
  },
  methods: {
    getImage (image) {
      if (image === '') {
        const mode = this._themePreference === 'light' ? 'lm' : 'dm'
        return require(`@/assets/icons/${mode}-team-profile.svg`)
      } else {
        return image
      }
    }
  }
}
</script>
