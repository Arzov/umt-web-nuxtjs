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
            <AgeSlider
              v-model="ruleForm.ageFilter"
              label="RANGO DE EDAD"
            />
          </a-form-model-item>
          <a-form-model-item>
            <PrincipalBtn
              text="CONTINUAR"
              :loading="btnLoading"
              @click.native="submitForm('ruleForm', false)"
            />
          </a-form-model-item>
        </a-form-model>
        <center>
          <TextBtn text="Omitir" @click.native="submitForm('ruleForm', true)" />
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
        genderFilter: 'M',
        ageFilter: [18, 22]
      }
    }
  },
  methods: {
    submitForm (formName, isSkip) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!isSkip) { this.btnLoading = true }
          this.$store
            .dispatch('optionalFilters/save', {
              email: this._userState.email,
              matchFilter: [this.ruleForm.matchFilter],
              genderFilter: [this.ruleForm.genderFilter],
              ageFilter: this.ruleForm.ageFilter,
              positions: this._userState.positions,
              skills: this._userState.skills,
              foot: this._userState.foot,
              weight: this._userState.weight,
              height: this._userState.height
            })
            .then(() => {
              this.btnLoading = false
            })
            .catch((e) => {
              this.showNotification(e.title, e.msg, e.type)
              this.btnLoading = false
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>
