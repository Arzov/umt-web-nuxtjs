<template>
  <div>
    <a-row>
      <a-col class="leftContent" :span="12">
        <div class="image">
          <img class="whistle" src="../../assets/images/whistle.svg">
        </div>
        <center>
          Ingresa tus filtros para poder encontrar rivales según tus preferencias.
          Puedes omitir estas opciones y configurarlas más adelante desde tu perfil.
        </center>
      </a-col>
      <a-col class="rightContent" :span="12">
        <h1>¿A qué rivales buscas?</h1>
        <br>
        <a-form-model ref="ruleForm" :model="ruleForm">
          <a-form-model-item>
            <OptionSelector
              v-model="ruleForm.matchFilter"
              label="TIPO DE JUEGO"
              :options="require('../../static/data/matchFilterOptions.json')"
            />
          </a-form-model-item>
          <a-form-model-item>
            <OptionSelector
              v-model="ruleForm.genderFilter"
              label="BUSCO RIVALES"
              :options="require('../../static/data/genderFilterOptions.json')"
            />
          </a-form-model-item>
          <a-form-model-item>
            <PrincipalBtn
              text="CONTINUAR"
              :loading="btnLoading"
              @click.native="submitForm('ruleForm')"
            />
          </a-form-model-item>
        </a-form-model>
        <center>
          <SignOutBtn />
        </center>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  layout: 'corners',
  data () {
    return {
      ruleForm: {
        matchFilter: '5v5',
        genderFilter: 'M'
      }
    }
  },
  methods: {
    submitForm (formName) {
      console.log(this.ruleForm.matchFilter)
      console.log(this.ruleForm.genderFilter)
      // this.$refs[formName].validate((valid) => {
      //   if (valid) {
      //     this.btnLoading = true
      //     this.$store
      //       .dispatch('requiredAttributes/save', {
      //         birthdate: this.ruleForm.birthdate,
      //         gender: this.ruleForm.gender
      //       })
      //       .then(() => {
      //         this.btnLoading = false
      //       })
      //       .catch((e) => {
      //         this.showNotification()
      //         this.btnLoading = false
      //       })
      //   } else {
      //     return false
      //   }
      // })
    }
  }
}
</script>
