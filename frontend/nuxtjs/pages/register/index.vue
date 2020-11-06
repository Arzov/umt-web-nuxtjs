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
        <nuxt-link class="backBtn" to="/" />
        <h1>Registro</h1>
        <br>
        <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules">
          <a-form-model-item :prop="this.$RULES.firstName.name">
            <a-input
              v-model="ruleForm.firstName"
              class="principalInput"
              :placeholder="this.$RULES.firstName.placeholder"
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
              label="FECHA DE NACIMIENTO*"
            />
          </a-form-model-item>
          <a-form-model-item>
            <GenderSelector
              v-model="ruleForm.gender"
              :values="ruleForm.gender"
            />
          </a-form-model-item>
          <center>
            *Tu edad y sexo permitirán a otros rivales encontrarte y desafiarte en un match.
          </center>
          <br>
          <a-form-model-item>
            <PrincipalBtn
              text="REGISTRAR"
              @click.native="submitForm('ruleForm')"
            />
          </a-form-model-item>
        </a-form-model>
        <center>
          <nuxt-link to="/">
            Términos y condiciones.
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
import GenderSelector from '@/components/genderSelector'

export default {
  components: { ThemeToggle, PrincipalBtn, DateSelector, GenderSelector },
  data () {
    return {
      ruleForm: {
        firstName: this.$RULES.firstName.initialValue,
        email: this.$RULES.email.initialValue,
        password: this.$RULES.password.initialValue,
        birthdate: {
          day: undefined,
          month: undefined,
          year: undefined
        },
        gender: {
          label: 'SEXO*',
          gender: 'M'
        }
      },
      rules: {
        firstName: this.$RULES.firstName.rules,
        email: this.$RULES.email.rules,
        password: this.$RULES.password.rules,
        birthdate: this.$RULES.birthdate.rules
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
          console.log(this.ruleForm.birthdate)
          console.log(this.ruleForm.gender)
        } else {
          console.log(this.ruleForm.birthdate)
          return false
        }
      })
    }
  }
}
</script>
