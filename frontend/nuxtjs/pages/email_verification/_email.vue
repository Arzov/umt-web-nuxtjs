<template>
  <div class="emailVerification">
    <a-row>
      <a-col class="leftContent" :span="12">
        <div class="image">
          <img class="mailbox" src="../../assets/images/mailbox.svg">
        </div>
        <center>
          Ingresa tu código secreto enviado a tu email registrado en <b>Arzov</b> para validar y
          poder iniciar sesión en la app.
        </center>
      </a-col>
      <a-col class="rightContent" :span="12">
        <BackBtn />
        <h1>Verifica tu email</h1>
        <br>
        <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules">
          <center>
            Ingresa tu código de verificación enviado a
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
          <br>
          <a-form-model-item>
            <PrincipalBtn
              text="ENVIAR"
              :loading="btnLoading"
              @click.native="submitForm('ruleForm')"
            />
          </a-form-model-item>
        </a-form-model>
        <center>
          <TextBtn
            text="Reenviar codigo"
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
        code: ''
      },
      rules: {
        code: this.$RULES.code.rules
      },
      emailVerificationState: this.$store.getters['emailVerification/getStates']
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          this.$store.dispatch('emailVerification/verify', {
            email: this.email.toLowerCase(),
            code: this.ruleForm.code
          })
            .then(() => {
              if (!this.emailVerificationState.confirmStatus) {
                this.showNotification(this.emailVerificationState.confirmTitle,
                  this.emailVerificationState.confirmMsg, this.emailVerificationState.confirmMsgType)
              }
              this.btnLoading = false
            })
        } else {
          return false
        }
      })
    },
    resendCode () {
      this.$store.dispatch('emailVerification/resendCode', {
        email: this.email.toLowerCase()
      })
        .then(() => {
          if (!this.emailVerificationState.confirmStatus) {
            this.showNotification(this.emailVerificationState.confirmTitle,
              this.emailVerificationState.confirmMsg, this.emailVerificationState.confirmMsgType)
          }
        })
    }
  }
}
</script>
