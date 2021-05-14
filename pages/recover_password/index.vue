<template>
    <div class="recoverPassword">
        <a-row>
            <a-col class="leftContent" :span="12">
                <div class="image">
                    <img class="key" src="../../assets/images/key.svg">
                </div>
                <center>
                    Ingresa tu email registrado en <b>Arzov</b>. Te enviaremos
                    un código de seguridad para poder restablecer tu contraseña.
                    <br><br>
                    Si recordaste tu contraseña puedes volver al inicio de
                    sesión.
                </center>
            </a-col>
            <a-col class="rightContent" :span="12">
                <BackBtn />
                <h1>Recupera tu contraseña</h1>
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
                    <br>
                    <center>
                        Te enviaremos un código a tu correo <br>
                        electrónico para recuperar la contraseña.
                    </center>
                    <br>
                    <a-form-model-item>
                        <PrincipalBtn
                            text="RECUPERAR CONTRASEÑA"
                            :loading="btnLoading"
                            @click.native="recoverPassword('ruleForm')"
                        />
                    </a-form-model-item>
                </a-form-model>
            </a-col>
        </a-row>
    </div>
</template>

<script>
export default {
    layout: 'corners',
    data () {
        return {
            ruleForm: {
                email: ''
            },
            rules: {
                email: this.$RULES.email.rules
            }
        }
    },
    methods: {
        recoverPassword (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.btnLoading = true
                    this.$store
                        .dispatch('recoverPassword/recover', {
                            email: this.ruleForm.email.toLowerCase()
                        })
                        .then(() => {
                            this.btnLoading = false
                        })
                        .catch((e) => {
                            this.showNotification(e.title, e.msg, e.type)
                            this.btnLoading = false
                        })
                }
                else {
                    return false
                }
            })
        }
    }
}
</script>
