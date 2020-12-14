<template>
  <div>
    <a-row>
      <a-col class="leftContent" :span="12">
        <img
          :src="
            _themePreference === 'light'
              ? require('../../static/lm-logo.svg')
              : require('../../static/dm-logo.svg')
          "
          class="logo"
        >
        <img
          class="footballShoes"
          src="../../assets/images/football-shoes.svg"
        >
        <img
          :src="
            _themePreference === 'light'
              ? require('../../assets/images/lm-points.svg')
              : require('../../assets/images/dm-points.svg')
          "
          class="points"
        >
      </a-col>
      <a-col class="rightContent" :span="12">
        <h1>Datos necesarios</h1>
        <br>
        <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules">
          <a-form-model-item :prop="this.$RULES.birthdate.name">
            <DateSelector
              v-model="ruleForm.birthdate"
              label="FECHA DE NACIMIENTO*"
            />
          </a-form-model-item>
          <a-form-model-item>
            <GenderSelector v-model="ruleForm.gender" label="SEXO*" />
          </a-form-model-item>
          <center>
            *Tu edad y sexo permitirán a otros rivales encontrarte y desafiarte
            en un match.
          </center>
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
          <TextBtn text="Cerrar sesión" @click.native="signOut()" />
        </center>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ruleForm: {
        birthdate: {
          day: undefined,
          month: undefined,
          year: undefined
        },
        gender: 'M'
      },
      rules: {
        birthdate: this.$RULES.birthdate.rules
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          this.$store
            .dispatch('requiredAttributes/save', {
              birthdate: this.ruleForm.birthdate,
              gender: this.ruleForm.gender
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
