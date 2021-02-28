<template>
  <div v-if="type == 'patch'" class="listDisplay">
    <div class="pictures patch">
      <figure>
        <a-avatar :src="getImage(picture1)" />
        <figcaption>
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>rpc</span>
            </template>
            <h4>rpc</h4>
          </a-tooltip>
        </figcaption>
      </figure>
      <b> - </b>
      <figure>
        <a-avatar :src="getImage(picture2)" />
        <figcaption>
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>asdasd</span>
            </template>
            <h4>asdasd</h4>
          </a-tooltip>
        </figcaption>
      </figure>
    </div>
    <div class="content patch">
      <figure class="count">
        <i> 2/3 </i>
        <figcaption>
          Parches
        </figcaption>
      </figure>
      <figure class="date">
        <i> 26/03 </i>
        <figcaption>
          Fecha
        </figcaption>
      </figure>
    </div>
    <div class="btn">
      <RoundedTextBtn text="unirse" />
    </div>
  </div>
  <div v-else class="listDisplay">
    <a-avatar size="large" :src="getImage(picture1)" />
    <div class="content">
      <h2>
        {{ title }}
      </h2>
      {{ desc }}
    </div>
    <div class="btn">
      <RoundedTextBtn text="solicitar" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    picture1: { type: String, default: '' },
    picture2: { type: String, default: '' },
    title: { type: String, default: '' },
    desc: { type: String, default: '' },
    type: { type: String, default: 'challenge' }
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
