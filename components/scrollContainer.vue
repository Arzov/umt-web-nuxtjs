<template>
    <div class="scrollContainer">
        <slot> </slot>
    </div>
</template>

<script>
export default {
    mounted() {
        // Reference: https://github.com/fjbarrientosg/infinite-scroll
        const listElm = document.querySelector(".scrollContainer");

        listElm.addEventListener("scroll", (e) => {
            if (
                listElm.scrollTop + listElm.clientHeight >=
                listElm.scrollHeight
            )
                this.emitInfiniteScroll();
        });
    },

    methods: {
        emitInfiniteScroll() {
            this.$emit("bottomScroll");
        },
    },
};
</script>
