<template>

    <div class="profile">

        <!-- HEADER -->

        <div class="header">

            <div class="toggle">
                <theme-toggle size="small" />
            </div>


            <div class="user">
                <umt-avatar size="large" :src="_userState.picture" />
            </div>


            <div class="labels">
                <h2 class="user-name">
                    {{ _userState.firstName }}
                </h2>
                <h2 v-if="_userState.teams.length" class="team-name">
                    {{ _userState.primaryTeam.name }}
                </h2>
            </div>


            <div class="team">
                <umt-avatar
                    v-if="_userState.teams.length"
                    class="team-picture"
                    icon="team-profile"
                    size="large"
                    color="purple"
                    :src="_userState.primaryTeam.picture"
                />
                <umt-button
                    v-if="_userState.teams.length > 1"
                    type="icon"
                    shape="square"
                    color="transparent"
                    icon="arrow-right"
                    @click="setPrimaryTeam"
                />
            </div>


            <div class="button">
                <back-btn />
            </div>

        </div>


        <!-- CONTENT -->

        <div class="center-content">

            <umt-tabs>

                <!-- ATTRIBUTES -->

                <umt-tab-panel tab="1" label="atributos">

                    <center>
                        <p>
                            Tu edad y sexo permitirán a otros rivales encontrarte y desafiarte en un match.
                        </p>
                    </center>

                    <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules">

                        <a-form-model-item :prop="$RULES.birthdate.name">
                            <label>
                                <h3>FECHA DE NACIMIENTO</h3>
                            </label>
                            <umt-date-picker v-model="ruleForm.birthdate" />
                        </a-form-model-item>

                        <a-form-model-item>
                            <label>
                                <h3>SEXO</h3>
                            </label>
                            <umt-radio-selector v-model="ruleForm.gender" :options="genderOptions" />
                        </a-form-model-item>

                        <a-row :gutter="12" type="flex">

                            <a-col :span="12" :flex="1">
                                <a-form-model-item :prop="$RULES.height.name">
                                    <label>
                                        <h3>ESTATURA</h3>
                                    </label>
                                    <umt-input
                                        v-model="ruleForm.height"
                                        placeholder="0"
                                        type="number"
                                        suffix="cm"
                                    />
                                </a-form-model-item>
                            </a-col>

                            <a-col :span="12" :flex="1">
                                <a-form-model-item :prop="$RULES.weight.name">
                                    <label>
                                        <h3>PESO</h3>
                                    </label>
                                    <umt-input
                                        v-model="ruleForm.weight"
                                        placeholder="0"
                                        type="number"
                                        suffix="kg"
                                    />
                                </a-form-model-item>
                            </a-col>

                        </a-row>

                    </a-form-model>

                </umt-tab-panel>


                <!-- SKILLS -->

                <umt-tab-panel tab="2" label="habilidades">

                    <center>
                        <p>
                            Tus habilidades nos permitirán conocerte mejor y también te
                            darás a conocer frente a otros jugadores.
                        </p>
                    </center>

                    <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules">

                        <a-form-model-item>
                            <label>
                                <h3>POSICIONES DE JUEGO</h3>
                            </label>
                            <umt-badge-group v-model="ruleForm.positions" :options="positionOptions" />
                        </a-form-model-item>

                        <a-form-model-item>
                            <label>
                                <h3>PIE HÁBIL</h3>
                            </label>
                            <umt-radio-selector v-model="ruleForm.foot" :options="footOptions" />
                        </a-form-model-item>

                    </a-form-model>

                </umt-tab-panel>


                <!-- FILTERS -->

                <umt-tab-panel tab="3" label="filtros">

                    <center>
                        <p>
                            Ingresa tus <b>filtros</b> para encontrar partidos cercanos
                            a ti a los cuales quieras <b>parchar</b> o simplemente para
                            buscar equipos a los cuales quieras <b>unirte</b>. Puedes
                            omitir estas opciones y configurarlas más adelante desde tu
                            perfil.
                        </p>
                    </center>

                    <a-form-model ref="ruleForm" :model="ruleForm">

                        <a-form-model-item>
                            <label>
                                <h3>TIPO DE JUEGO</h3>
                            </label>
                            <umt-multi-selector
                                v-model="ruleForm.matchFilter"
                                :options="matchFilterOptions"
                            />
                        </a-form-model-item>

                        <a-form-model-item>
                            <umt-range
                                v-model="ruleForm.ageFilter"
                                label="RANGO DE EDAD"
                                :min="18"
                                :max="60"
                            />
                        </a-form-model-item>

                    </a-form-model>

                </umt-tab-panel>

            </umt-tabs>

            <umt-button @click="submitForm('ruleForm')">
                GUARDAR
            </umt-button>

            <center>
                <signout-btn />
            </center>

        </div>

    </div>

</template>


<script>

const matchFilterOptions = require('@/static/data/matchFilterOptions.json')
const footOptions = require('@/static/data/footOptions.json')
const positionOptions = require('@/static/data/positionOptions.json')
const genderOptions = require('@/static/data/genderOptions.json')

export default {

    data () {
        return {

            matchFilterOptions,

            footOptions,

            positionOptions,

            genderOptions,

            ruleForm: {

                birthdate: {
                    day     : undefined,
                    month   : undefined,
                    year    : undefined
                },
                gender      : 'M',
                foot        : 'R',
                positions   : [''],
                weight      : 0,
                height      : 0,
                matchFilter : ['5v5'],
                ageFilter   : [18, 22]

            },

            rules: {
                birthdate   : this.$RULES.birthdate.rules,
                height      : this.$RULES.height.rules,
                weight      : this.$RULES.weight.rules
            }

        }
    },


    mounted () {
        // Init data from store
        this.ruleForm.birthdate.day = this._userState.birthdate.split('-')[2]
        this.ruleForm.birthdate.month = this._userState.birthdate.split('-')[1]
        this.ruleForm.birthdate.year = this._userState.birthdate.split('-')[0]
        this.ruleForm.gender = this._userState.gender
        this.ruleForm.weight = this._userState.weight
        this.ruleForm.height = this._userState.height
        this.ruleForm.positions = this._userState.positions
        this.ruleForm.foot = this._userState.foot
        this.ruleForm.matchFilter = this._userState.matchFilter
        this.ruleForm.ageFilter = [
            this._userState.ageMinFilter,
            this._userState.ageMaxFilter
        ]
    },


    methods: {

        submitForm (formName) {
            this.$refs[formName].validate((valid) => {

                if (valid) {
                    this.btnLoading = true

                    this.$store
                        .dispatch('profile/update', this.ruleForm)
                        .then(() => {
                            // this.showNotification(
                            //     '¡Cambios guardados!',
                            //     'Tus cambios fueron guardados exitósamente.',
                            //     'success'
                            // )
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
        },


        setPrimaryTeam () {

            const idx = this._userState.teams.map(t => t.id).indexOf(this._userState.primaryTeam.id)

            if (idx + 1 === this._userState.teams.length) {
                this.$store.dispatch('profile/setPrimaryTeam', this._userState.teams[0])
            }

            else {
                this.$store.dispatch('profile/setPrimaryTeam', this._userState.teams[idx + 1])
            }

        }

    }

}
</script>
