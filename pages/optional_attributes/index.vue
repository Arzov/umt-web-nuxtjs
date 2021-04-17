<template>
    <div class="optionalAttributes">
        <a-row>
            <a-col class="leftContent" :span="12">
                <div class="image">
                    <img
                        class="footballCircle"
                        load="lazy"
                        src="../../assets/images/football-circle.svg"
                    />
                </div>
                <center>
                    Tus habilidades nos permitirán conocerte mejor y también te
                    darás a conocer frente a otros jugadores.
                </center>
                <br />
                <div class="positionsDescriptions">
                    <div
                        v-for="k in require('../../static/data/positionOptions.json')"
                        :key="`ci${k.value}`"
                    >
                        <PositionBtn
                            :key="`pi${k.value}`"
                            :text="k.text"
                            :color="k.color"
                            :value="k.value"
                            style="margin-right: 10px"
                            disabled
                        />
                        {{ k.desc }}
                    </div>
                </div>
            </a-col>
            <a-col class="rightContent" :span="12">
                <h1>Habilidades y características</h1>
                <br />
                <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules">
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
                            :options="require('@/static/data/footOptions.json')"
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
                    <a-form-model-item>
                        <PrincipalBtn
                            text="CONTINUAR"
                            :loading="btnLoading"
                            @click.native="submitForm('ruleForm', false)"
                        />
                    </a-form-model-item>
                </a-form-model>
                <center>
                    <TextBtn
                        text="Omitir"
                        @click.native="submitForm('ruleForm', true)"
                    />
                </center>
            </a-col>
        </a-row>
    </div>
</template>

<script>
export default {
    layout: "corners",

    data() {
        return {
            ruleForm: {
                foot: "R",
                positions: [],
                weight: 0,
                height: 0,
            },
            rules: {
                height: this.$RULES.height.rules,
                weight: this.$RULES.weight.rules,
            },
        };
    },

    methods: {
        submitForm(formName, isSkip) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (!isSkip) {
                        this.btnLoading = true;
                    }
                    this.$store.dispatch("optionalAttributes/save", {
                        foot: this.ruleForm.foot,
                        positions: this.ruleForm.positions,
                        weight: this.ruleForm.weight,
                        height: this.ruleForm.height,
                    });

                    this.btnLoading = false;
                } else {
                    return false;
                }
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
    },
};
</script>
