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
        <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout">
          <a-form-model-item ref="name" prop="name">
            <a-input v-model="ruleForm.name" @blur="() => { $refs.name.onFieldBlur(); }" />
          </a-form-model-item>
          <a-form-model-item has-feedback prop="pass">
            <a-input v-model="ruleForm.pass" type="password" autocomplete="off" />
          </a-form-model-item>
          <a-form-model-item>
            <PrincipalBtn text="INICIAR SESIÓN" @click.native="submitForm('ruleForm')" />
          </a-form-model-item>
        </a-form-model>
        <br>
        - O ingresa con tus redes sociales -
        <GoogleLogin />
        <FacebookLogin />
        <b>No tienes cuenta?</b> <nuxt-link to="/">
          Regístrate.
        </nuxt-link>
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
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    return {
      ruleForm: {
        pass: '',
        name: ''
      },
      rules: {
        pass: [{ validator: validatePass, trigger: 'change' }],
        name: [
          { required: true, message: 'Please input Activity name', trigger: 'blur' },
          { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
