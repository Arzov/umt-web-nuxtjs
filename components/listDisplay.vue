<template>
  <div v-if="type == 'patch'" class="listDisplay">
    <div class="pictures patch">
      <figure>
        <a-avatar :src="getImage(match.picture1)" />
        <figcaption>
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>{{ match.name1 }}</span>
            </template>
            <h4>{{ match.name1 }}</h4>
          </a-tooltip>
        </figcaption>
      </figure>
      <b> - </b>
      <figure>
        <a-avatar :src="getImage(match.picture2)" />
        <figcaption>
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>{{ match.name2 }}</span>
            </template>
            <h4>{{ match.name2 }}</h4>
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
    <a-avatar size="large" :src="getImage(team.picture)" />
    <div class="content">
      <h2>
        {{ team.name }}
      </h2>
      A {{ team.distance }} kilómetros de distancia
    </div>
    <div class="btn">
      <RoundedTextBtn text="solicitar" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    match: { type: Object, default: () => {} },
    team: { type: Object, default: () => {} },
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
