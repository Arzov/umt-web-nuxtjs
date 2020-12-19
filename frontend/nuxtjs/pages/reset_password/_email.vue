<template>
  <div>
    <a-row>
      <a-col class="leftContent" :span="12">
        <div class="image">
          <img class="lock" src="../../assets/images/lock.svg">
        </div>
        <center>
          Ingresa tu código de seguridad enviado a tu email registrado en <b>Arzov</b>, luego ingresa tu nueva contraseña.
          Si recordaste tu antigua contraseña y no la quieres cambiar, sólo debes volver e ingresar a la app.
        </center>
      </a-col>
      <a-col class="rightContent" :span="12">
        <BackBtn />
        <h1>Cambia tu contraseña</h1>
        <br>
        <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules">
          <center>
            Ingresa tu código enviado a
            <nuxt-link to="">
              <i>{{ email }}</i>
            </nuxt-link>
          </center>
          <br>
          <a-form-model-item :prop="this.$RULES.code.name">
            <CodeInput
              v-model="ruleForm.code"
            />
          </a-form-model-item>
          <a-form-model-item :prop="this.$RULES.password.name">
            <PrincipalInput
              v-model="ruleForm.password"
              placeholder="Ingresa tu nueva contraseña"
              :type="this.$RULES.password.type"
              :autocomplete="this.$RULES.password.autocomplete"
            />
          </a-form-model-item>
          <a-form-model-item>
            <PrincipalBtn
              text="CAMBIAR CONTRASEÑA"
              :loading="btnLoading"
              @click.native="submitForm('ruleForm')"
            />
          </a-form-model-item>
        </a-form-model>
        <center>
          <TextBtn
            text="Reenviar código"
            @click.native="resendCode"
          />
        </center>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  layout: 'corners',
  asyncData ({ params }) {
    return {
      email: params.email
    }
  },
  validate ({ params, query, store }) {
    if (params.email) { return true } else { return false }
  },
  data () {
    return {
      ruleForm: {
        code: '',
        password: ''
      },
      rules: {
        code: this.$RULES.code.rules,
        password: this.$RULES.password.rules
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          this.$store.dispatch('resetPassword/reset', {
            email: this.email.toLowerCase(),
            code: this.ruleForm.code,
            password: this.ruleForm.password
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
    },
    resendCode () {
      this.$store.dispatch('resetPassword/resendCode', {
        email: this.email.toLowerCase()
      })
        .then(() => {
          this.showNotification()
        })
        .catch((e) => {
          this.showNotification()
        })
    }
  }
}
</script>
