<template>
  <div>
    <a-row type="flex" justify="space-around" align="middle">
      <a-col :span="12">
        <ThemeToggle />
        <img class="logo">
        <img class="football-shoes" src="../../assets/images/football-shoes.svg">
        <img class="points">
      </a-col>
      <a-col class="right-content" :span="12">
        <h1>Inicio de sesión</h1>
        <b>¿Olvidaste tu contraseña?</b> <nuxt-link to="/">
          Recupérala.
        </nuxt-link>
        <br>
        <br>
        <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules">
          <a-form-model-item :prop="this.$RULES.email.name">
            <a-input
              v-model="ruleForm.email"
              class="principalInput"
              :placeholder="this.$RULES.email.placeholder"
            />
          </a-form-model-item>
          <a-form-model-item :prop="this.$RULES.password.name">
            <a-input
              v-model="ruleForm.password"
              class="principalInput"
              :placeholder="this.$RULES.password.placeholder"
              type="password"
              autocomplete="off"
            />
          </a-form-model-item>
          <a-form-model-item>
            <PrincipalBtn text="INICIAR SESIÓN" @click.native="submitForm('ruleForm')" />
          </a-form-model-item>
        </a-form-model>
        <center>
          - O ingresa con tus redes sociales -
          <br>
          <br>
          <a-row>
            <a-col :span="6" />
            <a-col :span="6">
              <GoogleLogin />
            </a-col>
            <a-col :span="6">
              <FacebookLogin />
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
import GoogleLogin from '@/components/google'
import FacebookLogin from '@/components/facebook'
import ThemeToggle from '@/components/themeToggle'
import PrincipalBtn from '@/components/principalBtn'

export default {
  components: { GoogleLogin, FacebookLogin, ThemeToggle, PrincipalBtn },
  data () {
    return {
      ruleForm: {
        email: this.$RULES.email.initialValue,
        password: this.$RULES.password.initialValue
      },
      rules: {
        email: this.$RULES.email.rules,
        password: this.$RULES.password.rules
      }
    }
  },
  computed: {
    _email () {
      return this.ruleForm.email.toLowerCase()
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('start/signIn', {
            email: this._email,
            password: this.ruleForm.password
          })
        } else { return false }
      })
    }
  }
}
</script>
