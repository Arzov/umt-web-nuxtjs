<template>
  <div class="start">
    <a-row>
      <a-col class="leftContent" :span="12">
        <img
          :src="_themePreference === 'light' ? require('../../static/lm-logo.svg') :
            require('../../static/dm-logo.svg')"
          class="logo"
        >
        <img class="footballShoes" src="../../assets/images/football-shoes.svg">
        <img
          :src="_themePreference === 'light' ? require('../../assets/images/lm-points.svg') :
            require('../../assets/images/dm-points.svg')"
          class="points"
        >
      </a-col>
      <a-col class="rightContent" :span="12">
        <h1>Inicio de sesión</h1>
        <b>¿Olvidaste tu contraseña? <nuxt-link to="/recover_password">
          Recupérala.
        </nuxt-link></b>
        <br>
        <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules">
          <a-form-model-item :prop="this.$RULES.email.name">
            <PrincipalInput
              v-model="ruleForm.email"
              :placeholder="this.$RULES.email.placeholder"
              name="email"
              :type="this.$RULES.email.type"
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
          <div class="socialLogin">
            <Google />
            <Facebook />
          </div>
          <br>
          <b>¿No tienes cuenta? <nuxt-link to="/register">
            Regístrate.
          </nuxt-link></b>
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
      }
    }
  },
  mounted () {
    this.$AWS.Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn': {
          const email = data.signInUserSession.idToken.payload.email
          this.$store.dispatch('user/fetch', { email })
            .then((result) => {
              this.btnLoading = false
              this.$router.push('/home')
            })
            .catch((e) => {
              this.showNotification(e.title, e.msg, e.type)
              this.btnLoading = false
            })

          break
        }
      }
    })
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
