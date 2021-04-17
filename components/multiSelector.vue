<template>
    <div class="multiSelector">
        <label>
            <h4>{{ label }}</h4>
        </label>
        <div class="container">
            <div
                v-for="(o, i) in opts"
                :key="`o${i}`"
                :class="`option ${o.stat}`"
                @click="toggle(o.value, i)"
            >
                <b>{{ o.key }}</b>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        label: { type: String, default: "Selecciona" },
        options: { type: Array, default: () => [] },
        value: { type: Array, default: () => [] },
    },

    data() {
        const opts = this.options.map((option) => {
            if (this.value.includes(option.key))
                return { ...option, stat: "on" };
            else return option;
        });

        const val = opts
            .map((option) => {
                if (option.stat === "on") {
                    return option.value;
                }
            })
            .filter(function (el) {
                return el != null;
            });

        return {
            opts,
            val,
        };
    },

    methods: {
        toggle(v, i) {
            if (this.opts[i].stat === "on") {
                if (this.val.length > 1) {
                    this.opts[i].stat = "off";
                    this.val = this.val.filter((value) => {
                        return value !== v;
                    });
                }
            } else {
                this.opts[i].stat = "on";
                this.val.push(this.opts[i].value);
            }

            this.$emit("input", this.val);
            this.$emit("change", this.val);
        },
    },
};
</script>
