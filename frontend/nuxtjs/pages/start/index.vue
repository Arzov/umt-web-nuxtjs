<template>
  <div class="page">
    <a-row type="flex" justify="space-around" align="middle">
      <a-col :span="12">
        <ThemeToggle />
        <img
          :src="_themePreference === 'light' ? require('../../static/lm-logo.svg') :
            require('../../static/dm-logo.svg')"
          class="logo"
        >
        <img class="football-shoes" src="../../assets/images/football-shoes.svg">
        <img
          :src="_themePreference === 'light' ? require('../../assets/images/lm-points.svg') :
            require('../../assets/images/dm-points.svg')"
          class="points"
        >
      </a-col>
      <a-col class="rightContent" :span="12">
        <h1>Inicio de sesión</h1>
        <b>¿Olvidaste tu contraseña?</b> <nuxt-link to="/">
          Recupérala.
        </nuxt-link>
        <br>
        <br>
        <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules">
          <a-form-model-item :prop="this.$RULES.email.name">
            <PrincipalInput
              v-model="ruleForm.email"
              :placeholder="this.$RULES.email.placeholder"
              name="email"
              type="email"
              autocomplete="email"
            />
          </a-form-model-item>
          <a-form-model-item :prop="this.$RULES.password.name">
            <PrincipalInput
              v-model="ruleForm.password"
              :placeholder="this.$RULES.password.placeholder"
              :type="this.$RULES.password.type"
              :autocomplete="this.$RULES.password.autocomplete"
            />
          </a-form-model-item>
          <a-form-model-item>
            <PrincipalBtn
              text="INICIAR SESIÓN"
              :loading="btnLoading"
              @click.native="submitForm('ruleForm')"
            />
          </a-form-model-item>
        </a-form-model>
        <center>
          - O ingresa con tus redes sociales -
          <br>
          <br>
          <a-row>
            <a-col :span="6" />
            <a-col :span="6">
              <Google />
            </a-col>
            <a-col :span="6">
              <Facebook />
            </a-col>
            <a-col :span="6" />
          </a-row>
          <br>
          <b>No tienes cuenta?</b> <nuxt-link to="/register">
            Regístrate.
          </nuxt-link>
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
        email: '',
        password: ''
      },
      rules: {
        email: this.$RULES.email.rules,
        password: this.$RULES.password.rules
      },
      startState: this.$store.getters['start/getStates']
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          this.$store.dispatch('start/signIn', {
            email: this.ruleForm.email.toLowerCase(),
            password: this.ruleForm.password
          })
            .then(() => {
              if (!this.startState.signInStatus) {
                this.showNotification(this.startState.signInTitle,
                  this.startState.signInMsg, this.startState.signInMsgType)
              }
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
