<template>
  <div class="collapseBtn">
    <a-collapse v-model="activeKey" expand-icon-position="right">
      <template #expandIcon="props">
        <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
      </template>
      <img src="@/assets/icons/lm-team-profile.svg" style="width:35px;" alt="" class="teamIcon">
      <a-collapse-panel key="1" :header="headerText">
        <RequestBtn
          title="Matias"
          desc="Solicitud enviada"
          picture1="https://media.githubusercontent.com/media/Arzov/umt-web-uxi/develop/mockup/images/matias_profile_bw_512x512.jpg"
          type="out"
        />
        <a-divider class="divider" />
        <RequestBtn
          title="Jesús"
          desc="Aceptar solicitud"
          picture1="https://media.githubusercontent.com/media/Arzov/umt-web-uxi/develop/mockup/images/jesus_profile_bw_512x512.jpg"
        />
        <a-divider class="divider" />
      </a-collapse-panel>
      <img :src="_userState.picture" style="width:35px; border-radius: 20px;" alt="" class="teamIcon">
      <a-collapse-panel key="2" header="MIS SOLICITUDES (2)">
        <RequestBtn
          title="BAYERN"
          desc="Solicitud enviada"
          type="out"
        />
        <a-divider class="divider" />
        <RequestBtn
          title="FC BARCELONA"
          desc="Aceptar solicitud"
        />
        <a-divider class="divider" />
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script>
export default {
  props: {
    teamName: { type: String, default: 'TEAM' },
    totalRequest: { type: Number, default: 2 } /* TODO: debe cambiarse por la cantidad de solicitudes totales */
  },
  data () {
    return {
      activeKey: ['1'],
      headerText: this.teamName + ' (' + this.totalRequest + ')'
    }
  },
  watch: {
    activeKey (key) {
      console.log(key)
    }
  }
}
</script>
