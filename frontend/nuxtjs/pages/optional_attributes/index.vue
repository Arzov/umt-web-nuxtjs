<template>
  <div class="optionalAttributes">
    <a-row>
      <a-col class="leftContent" :span="12">
        <div class="image">
          <img class="footballCircle" load="lazy" src="../../assets/images/football-circle.svg">
        </div>
        <center>
          Tus habilidades nos permitirán conocerte mejor y también te <br> darás a conocer frente a otros jugadores.
        </center>
        <br>
        <a-row>
          <a-col class="leftContent" :span="12">
            <a-row>
              <PositionBtn text="PO" color="Cian" disabled />
              <justify>
                Portero
              </justify>
            </a-row>
            <a-row>
              <PositionBtn text="DFI" color="Violet" disabled />
              <justify>
                Defensa Izquierdo
              </justify>
            </a-row>
            <a-row>
              <PositionBtn text="DFC" color="Violet" disabled />
              <justify>
                Defensa central
              </justify>
            </a-row>
            <a-row>
              <PositionBtn text="DFD" color="Violet" disabled />
              <justify>
                Defensa derecho
              </justify>
            </a-row>
            <a-row>
              <PositionBtn text="MI" color="Pink" disabled />
              <justify>
                Medio campo izquierdo
              </justify>
            </a-row>
          </a-col>
          <a-col class="rightContent" :span="12">
            <a-row>
              <PositionBtn text="MC" color="Pink" disabled />
              <justify>
                Medio campo
              </justify>
            </a-row>
            <a-row>
              <PositionBtn text="MD" color="Pink" disabled />
              <justify>
                Medio campo derecho
              </justify>
            </a-row>
            <a-row>
              <PositionBtn text="DI" color="Purple" disabled />
              <justify>
                Delantero izquierdo
              </justify>
            </a-row>
            <a-row>
              <PositionBtn text="DC" color="Purple" disabled />
              <justify>
                Delantero centro
              </justify>
            </a-row>
            <a-row>
              <PositionBtn text="DD" color="Purple" disabled />
              <justify>
                Delantero derecho
              </justify>
            </a-row>
          </a-col>
        </a-row>
      </a-col>
      <a-col class="rightContent" :span="12">
        <h1>Habilidades y <br>características</h1>
        <br>
        <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules">
          <h4>POSICIONES DE JUEGO</h4>
          <br>
          <a-row :gutter="[48,48]" type="flex">
            <a-col :span="4.8">
              <PositionBtn text="PO" color="Cian" />
            </a-col>
            <a-col :span="4.8">
              <PositionBtn text="DFI" color="Violet" />
            </a-col>
            <a-col :span="4.8">
              <PositionBtn text="DFC" color="Violet" />
            </a-col>
            <a-col :span="4.8">
              <PositionBtn text="DFD" color="Violet" />
            </a-col>
            <a-col :span="4.8">
              <PositionBtn text="MI" color="Pink" />
            </a-col>
          </a-row>
          <a-row :gutter="[48,48]" type="flex">
            <a-col :span="4.8">
              <PositionBtn text="MC" color="Pink" />
            </a-col>
            <a-col :span="4.8">
              <PositionBtn text="MD" color="Pink" />
            </a-col>
            <a-col :span="4.8">
              <PositionBtn text="DI" color="Purple" />
            </a-col>
            <a-col :span="4.8">
              <PositionBtn text="DC" color="Purple" />
            </a-col>
            <a-col :span="4.8">
              <PositionBtn text="DD" color="Purple" />
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

<script defer>
export default {
  layout: 'corners',
  data () {
    return {
      ruleForm: {
        foot: 'R'
      },
      rules: {
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          this.$store
            .dispatch('optionalAttributes/save', {
              birthdate: this.ruleForm.birthdate,
              foot: this.ruleForm.foot
            })
            .then(() => {
              this.btnLoading = false
            })
            .catch((e) => {
              this.showNotification()
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
