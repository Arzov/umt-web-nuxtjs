<template>
  <div v-if="type == 'patch'" class="listDisplay">
    <div :class="`pictures patch ${loading ? 'loading' : ''}`">
      <figure>
        <LoadingAvatar v-if="loading" />
        <a-avatar v-if="!loading" :src="getImage(match.picture1)" />
        <figcaption v-if="!loading">
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>{{ match.name1 }}</span>
            </template>
            <h4>
              {{ match.name1 }}
            </h4>
          </a-tooltip>
        </figcaption>
      </figure>
      <b> - </b>
      <figure>
        <LoadingAvatar v-if="loading" />
        <a-avatar v-if="!loading" :src="getImage(match.picture2)" />
        <figcaption v-if="!loading">
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>{{ match.name2 }}</span>
            </template>
            <h4>
              {{ match.name2 }}
            </h4>
          </a-tooltip>
        </figcaption>
      </figure>
    </div>
    <div class="content patch">
      <figure v-if="loading" class="loading">
        <i><LoadingText type="title" /></i>
        <figcaption>
          <LoadingText />
        </figcaption>
      </figure>
      <figure v-if="!loading" class="count">
        <i> {{ match.allowedPatches }} </i>
        <figcaption>
          Parches
        </figcaption>
      </figure>
      <figure v-if="!loading" class="date">
        <i> {{ `${match.schedule.day.S.substr(8,2)}/${match.schedule.day.S.substr(5,2)}` }} </i>
        <figcaption>
          Fecha
        </figcaption>
      </figure>
    </div>
    <div v-if="!loading" class="btn">
      <RoundedTextBtn text="unirse" />
    </div>
  </div>
  <div v-else class="listDisplay">
    <LoadingAvatar v-if="loading" size="large" />
    <a-avatar v-if="!loading" size="large" :src="getImage(team.picture)" />
    <div class="content">
      <h2>
        <LoadingText v-if="loading" type="title" />
        {{ !loading ? team.name : '' }}
      </h2>
      <LoadingText v-if="loading" />
      <div v-if="!loading">
        A {{ team.distance }} kilómetros de distancia
      </div>
    </div>
    <div v-if="!loading" class="btn">
      <RoundedTextBtn text="solicitar" />
    </div>
  </div>
</template>

<script>
import loadingAvatar from './loadingAvatar.vue'
export default {
  components: { loadingAvatar },
  props: {
    match: { type: Object, default: () => {} },
    team: { type: Object, default: () => {} },
    loading: { type: Boolean, default: false },
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
