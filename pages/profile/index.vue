<template>
    <div class="profile">
        <!-- <div class="header">
            <ThemeToggle />
        </div> -->

        <a-row>
            <a-col class="leftContent" :span="8">
                <BackBtn />

                <ProfileDisplay :user="_userState" />

                <br />

                <PrimaryTeamSelector
                    :teams="_userState.teams"
                    :primary-team="_userState.primaryTeam"
                    @click="setPrimaryTeam"
                />

                <br />

                <PrincipalBtn
                    text="GUARDAR"
                    :loading="btnLoading"
                    @click.native="submitForm('ruleForm')"
                />

                <br />

                <center>
                    <SignOutBtn />
                </center>
            </a-col>

            <a-col class="rightContent" :span="16">
                <div class="content">
                    <center>
                        <label><h3>ATRIBUTOS</h3></label>
                    </center>

                    <br />

                    <a-form-model
                        ref="ruleForm"
                        :model="ruleForm"
                        :rules="rules"
                    >
                        <a-form-model-item :prop="$RULES.birthdate.name">
                            <DateSelector
                                v-model="ruleForm.birthdate"
                                label="FECHA DE NACIMIENTO*"
                            />
                        </a-form-model-item>

                        <a-form-model-item>
                            <OptionSelector
                                v-model="ruleForm.gender"
                                label="SEXO*"
                                :options="
                                    require('@/static/data/genderOptions.json')
                                "
                            />
                        </a-form-model-item>

                        <a-row :gutter="16" type="flex">
                            <a-col :span="12">
                                <a-form-model-item :prop="$RULES.height.name">
                                    <MetricInput
                                        v-model="ruleForm.height"
                                        label="ESTATURA"
                                        suffix="cm"
                                    />
                                </a-form-model-item>
                            </a-col>

                            <a-col :span="12">
                                <a-form-model-item :prop="$RULES.weight.name">
                                    <MetricInput
                                        v-model="ruleForm.weight"
                                        label="PESO"
                                        suffix="kg"
                                    />
                                </a-form-model-item>
                            </a-col>
                        </a-row>

                        <center>
                            *Tu edad y sexo permitirán a otros rivales
                            encontrarte y desafiarte en un match.
                        </center>
                    </a-form-model>

                    <br />
                    <br />

                    <center>
                        <label><h3>HABILIDADES</h3></label>
                    </center>

                    <br />

                    <a-form-model
                        ref="ruleForm"
                        :model="ruleForm"
                        :rules="rules"
                    >
                        <h4>POSICIONES DE JUEGO</h4>

                        <br />

                        <a-row :gutter="[48, 48]" type="flex">
                            <a-col
                                v-for="k in require('@/static/data/positionOptions.json')"
                                :key="`c${k.value}`"
                                :span="4.8"
                            >
                                <PositionBtn
                                    :key="`p${k.value}`"
                                    :text="k.text"
                                    :color="k.color"
                                    :value="k.value"
                                    @change="setPosition($event)"
                                />
                            </a-col>
                        </a-row>

                        <br />

                        <a-form-model-item>
                            <OptionSelector
                                v-model="ruleForm.foot"
                                label="PIE HÁBIL"
                                :options="
                                    require('@/static/data/footOptions.json')
                                "
                            />
                        </a-form-model-item>
                    </a-form-model>

                    <br />
                    <br />

                    <center>
                        <label><h3>FILTROS</h3></label>
                    </center>

                    <br />

                    <a-form-model ref="ruleForm" :model="ruleForm">
                        <a-form-model-item>
                            <MultiSelector
                                v-model="ruleForm.matchFilter"
                                label="TIPO DE JUEGO (SELECCIONA 1 O MÁS)"
                                :options="
                                    require('@/static/data/matchFilterOptions.json')
                                "
                            />
                        </a-form-model-item>
                        <a-form-model-item>
                            <AgeSlider
                                v-model="ruleForm.ageFilter"
                                label="RANGO DE EDAD"
                            />
                        </a-form-model-item>
                    </a-form-model>
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            ruleForm: {
                birthdate: {
                    day: undefined,
                    month: undefined,
                    year: undefined,
                },
                gender: "M",
                foot: "R",
                positions: [],
                weight: 0,
                height: 0,
                matchFilter: ["7v7"],
                ageFilter: [18, 22],
            },

            rules: {
                birthdate: this.$RULES.birthdate.rules,
                height: this.$RULES.height.rules,
                weight: this.$RULES.weight.rules,
            },
        };
    },

    mounted() {
        // Init data from store
        this.ruleForm.birthdate.day = this._userState.birthdate.split("-")[2];
        this.ruleForm.birthdate.month = this._userState.birthdate.split("-")[1];
        this.ruleForm.birthdate.year = this._userState.birthdate.split("-")[0];
        this.ruleForm.gender = this._userState.gender;
        this.ruleForm.weight = this._userState.weight;
        this.ruleForm.height = this._userState.height;
        this.ruleForm.positions = this._userState.positions;
        this.ruleForm.foot = this._userState.foot;
        this.ruleForm.matchFilter = this._userState.matchFilter;
        this.ruleForm.ageFilter[0] = this._userState.ageMinFilter;
        this.ruleForm.ageFilter[1] = this._userState.ageMaxFilter;
    },

    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.btnLoading = true;

                    this.$store
                        .dispatch("profile/update", this.ruleForm)
                        .then(() => {
                            this.showNotification(
                                "¡Cambios guardados!",
                                "Tus cambios fueron guardados exitósamente.",
                                "success"
                            );
                            this.btnLoading = false;
                        })
                        .catch((e) => {
                            this.showNotification(e.title, e.msg, e.type);
                            this.btnLoading = false;
                        });
                } else return false;
            });
        },
        setPosition(e) {
            if (e.value !== null) {
                this.ruleForm.positions.push(e.value);
            } else {
                this.ruleForm.positions = this.ruleForm.positions.filter(
                    (value) => {
                        return value !== e.key;
                    }
                );
            }
        },
        setPrimaryTeam(team) {
            this.$store.dispatch("profile/setPrimaryTeam", team);
        },
    },
};
</script>
