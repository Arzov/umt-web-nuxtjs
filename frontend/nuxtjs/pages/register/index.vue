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
        <h1>Registro</h1>
        <br>
        <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules">
          <a-form-model-item :prop="this.$RULES.firstname.name">
            <a-input
              v-model="ruleForm.firstname"
              class="principalInput"
              :placeholder="this.$RULES.firstname.placeholder"
            />
          </a-form-model-item>
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
          <a-form-model-item :prop="this.$RULES.birthdate.name">
            <DateSelector
              v-model="ruleForm.birthdate"
              :values="ruleForm.birthdate"
            />
          </a-form-model-item>
          <a-form-model-item>
            <PrincipalBtn
              text="REGISTRAR"
              @click.native="submitForm('ruleForm')"
            />
          </a-form-model-item>
        </a-form-model>
        <center>
          <br>
          <b>No tienes cuenta?</b> <nuxt-link to="/">
            Regístrate.
          </nuxt-link>
        </center>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import ThemeToggle from '@/components/themeToggle'
import PrincipalBtn from '@/components/principalBtn'
import DateSelector from '@/components/dateSelector'

export default {
  components: { ThemeToggle, PrincipalBtn, DateSelector },
  data () {
    return {
      ruleForm: {
        firstname: this.$RULES.firstname.initialValue,
        email: this.$RULES.email.initialValue,
        password: this.$RULES.password.initialValue,
        birthdate: {
          label: 'FECHA DE NACIMIENTO*',
          day: undefined,
          month: undefined,
          year: undefined
        }
      },
      rules: {
        firstname: this.$RULES.firstname.rules,
        email: this.$RULES.email.rules,
        password: this.$RULES.password.rules,
        birthdate: this.$RULES.birthdate.rules
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
