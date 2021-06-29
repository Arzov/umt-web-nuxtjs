<template>

    <div class="recover-password">


        <!-- LEFT CONTENT -->

        <div class="left-content">

            <div class="image">
                <img src="@/assets/images/key.svg">
            </div>

            <center>
                <p>
                    Ingresa tu email registrado en <b>Arzov</b>. Te enviaremos
                    un código de seguridad para poder restablecer tu contraseña.
                </p>

                <p>
                    Si recordaste tu contraseña puedes volver al inicio de
                    sesión.
                </p>
            </center>

        </div>


        <!-- RIGHT CONTENT -->

        <div class="right-content">

            <back-btn />

            <h1>Recupera tu contraseña</h1>

            <br>

            <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules">

                <a-form-model-item :prop="$RULES.email.name">
                    <umt-input
                        v-model="ruleForm.email"
                        name="email"
                        autocomplete="email"
                        type="email"
                        :placeholder="$RULES.email.placeholder"
                    />
                </a-form-model-item>

                <center>
                    <p>
                        Te enviaremos un código a tu correo <br>
                        electrónico para recuperar la contraseña.
                    </p>
                </center>

                <a-form-model-item>
                    <umt-button @click="submitForm('ruleForm')">
                        RECUPERAR CONTRASEÑA
                    </umt-button>
                </a-form-model-item>

            </a-form-model>

        </div>

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
        submitForm (formName) {

            this.$refs[formName].validate((valid) => {

                if (valid) {

                    this.btnLoading = true

                    this.$store.dispatch('recoverPassword/recover', {
                        email: this.ruleForm.email.toLowerCase()
                    })
                        .then(() => {
                            this.btnLoading = false
                        })
                        .catch((e) => {
                            this.btnLoading = false
                            this.showNotification(e.title, e.msg, e.type)
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
