<template>
  <div class="teams">
    <a-row>
      <a-col class="leftContent" :span="8">
        <a-row class="shield">
          <img src="@/assets/images/shield.svg" alt="">
        </a-row>
        <a-row class="options">
          <TeamTabs />
          <br>
          <center>
            * Sólo puedes pertenecer o crear un máximo de 3 equipos.
          </center>
          <br>
          <a-form-model-item>
            <PrincipalBtn
              text="+ CREAR EQUIPO (1/3)"
              :loading="btnLoading"
              @click.native="submitForm('ruleForm')"
            />
          </a-form-model-item>
        </a-row>
      </a-col>
      <a-col class="rightContent" :span="16">
        <a-row class="banner">
          <BannerChat @click.native="click()" />
        </a-row>
        <a-row class="chat">
          COMPONENTE PARA EL CHAT
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  layout: 'navbar',
  methods: {
    click () {
      console.log('Probando click de BannerChat')
    }
  }
}
</script>
