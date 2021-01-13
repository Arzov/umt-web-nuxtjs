<template>
  <div class="optionalAttributes">
    <a-row>
      <a-col class="leftContent" :span="12">
        <div class="image">
          <img class="footballCircle" load="lazy" src="../../assets/images/football-circle.svg">
        </div>
        <center>
          Tus habilidades nos permitirán conocerte mejor y
          también te darás a conocer frente a otros jugadores.
        </center>
        <br>
        <a-row>
          <a-col class="leftContent" :span="24">
            <a-row
              v-for="k in require('../../static/data/positionOptions.json')"
              :key="`ci${k.value}`"
            >
              <PositionBtn
                :key="`pi${k.value}`"
                :text="k.text"
                :color="k.color"
                :value="k.value"
                disabled
              />
              {{ k.desc }}
            </a-row>
          </a-col>
        </a-row>
      </a-col>
      <a-col class="rightContent" :span="12">
        <h1>Habilidades y características</h1>
        <br>
        <a-form-model ref="ruleForm" :model="ruleForm">
          <h4>POSICIONES DE JUEGO</h4>
          <br>
          <a-row :gutter="[48, 48]" type="flex">
            <a-col
              v-for="k in require('../../static/data/positionOptions.json')"
              :key="`c${k.value}`"
              :span="4.8"
            >
              <PositionBtn
                :key="`p${k.value}`"
                :text="k.text"
                :color="k.color"
                :value="k.value"
                @change="setPosition($event)"
              />
            </a-col>
          </a-row>
          <br>
          <a-form-model-item>
            <FootSelector v-model="ruleForm.foot" label="PIE HÁBIL*" />
          </a-form-model-item>
          <a-form-model-item />
          <br>
          <a-form-model-item>
            <PrincipalBtn
              text="CONTINUAR"
              :loading="btnLoading"
              @click.native="submitForm('ruleForm')"
            />
          </a-form-model-item>
        </a-form-model>
        <center>
          <!-- TODO: enlazar con vista optionalFilters -->
          <nuxt-link to="#">
            Omitir
          </nuxt-link>
          <b />
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
        foot: 'R',
        positions: []
      }
    }
  },
  methods: {
    submitForm (formName) {
      console.log(this.ruleForm)
      // this.$refs[formName].validate((valid) => {
      //   if (valid) {
      //     this.btnLoading = true
      //     this.$store
      //       .dispatch('optionalAttributes/save', {
      //         birthdate: this.ruleForm.birthdate,
      //         foot: this.ruleForm.foot
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
    },
    setPosition (e) {
      console.log(e)
    }
  }
}
</script>
