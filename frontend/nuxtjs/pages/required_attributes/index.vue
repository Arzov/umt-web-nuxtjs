<template>
  <div>
    <a-row>
      <a-col class="leftContent" :span="12">
        <div class="image">
          <img class="cupTriangle" src="../../assets/images/cup-triangle.svg">
        </div>
        <center>
          Necesitamos estos datos para que otros rivales te puedan desafiar.
          De lo contrario, no podrás utilizar la app.
        </center>
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
            <OptionSelector
              v-model="ruleForm.gender"
              label="SEXO*"
              :options="require('../../static/data/genderOptions.json')"
            />
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
          <SignOutBtn />
        </center>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { signOut } from '@/plugins/mixins'

export default {
  layout: 'corners',
  mixins: [signOut],
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
      },
      userState: this.$store.getters['user/getUser']
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          this.$store
            .dispatch('requiredAttributes/save', {
              email: this.userState.email,
              firstName: this.userState.firstName,
              lastName: this.userState.lastName,
              picture: this.userState.picture,
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
