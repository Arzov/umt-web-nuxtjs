<template>
    <div class="ageSlider">
        <label>
            <h4>
                {{ label }}
                <p v-if="value[1] === 60" class="range">
                    {{ _textRange.min }} - {{ _textRange.max }}+
                </p>
                <p v-else class="range">
                    {{ _textRange.min }} - {{ _textRange.max }}
                </p>
            </h4>
        </label>
        <a-slider
            range
            :value="value"
            :min="fullRange.min"
            :max="fullRange.max"
            @change="triggerChange"
        />
    </div>
</template>

<script>
export default {
    props: {
        label: { type: String, default: "Rango" },
        value: {
            type: Array,
            required: true,
        },
        fullRange: {
            type: Object,
            default: () => {
                return {
                    min: 18,
                    max: 60,
                };
            },
        },
    },

    computed: {
        _textRange() {
            return {
                min: this.value[0],
                max: this.value[1],
            };
        },
    },

    methods: {
        triggerChange(e) {
            this.$emit("input", e);
            this.$emit("change", e);
        },
    },
};
</script>
