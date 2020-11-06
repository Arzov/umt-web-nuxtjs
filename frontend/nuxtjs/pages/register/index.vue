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
        <BackBtn />
        <h1>Registro</h1>
        <br>
        <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules">
          <a-form-model-item :prop="this.$RULES.firstName.name">
            <PrincipalInput
              v-model="ruleForm.firstName"
              :placeholder="this.$RULES.firstName.placeholder"
            />
          </a-form-model-item>
          <a-form-model-item :prop="this.$RULES.email.name">
            <PrincipalInput
              v-model="ruleForm.email"
              :placeholder="this.$RULES.email.placeholder"
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
          <a-form-model-item :prop="this.$RULES.birthdate.name">
            <DateSelector
              v-model="ruleForm.birthdate"
              label="FECHA DE NACIMIENTO*"
            />
          </a-form-model-item>
          <a-form-model-item>
            <GenderSelector
              v-model="ruleForm.gender"
              label="SEXO*"
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
import BackBtn from '@/components/backBtn'

export default {
  components: { ThemeToggle, PrincipalBtn, DateSelector, GenderSelector, BackBtn },
  data () {
    return {
      ruleForm: {
        firstName: '',
        email: '',
        password: '',
        birthdate: {
          day: undefined,
          month: undefined,
          year: undefined
        },
        gender: 'M'
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
          console.log(this.ruleForm)
          return false
        }
      })
    }
  }
}
</script>
