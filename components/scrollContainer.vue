<template>

    <div class="scroll-container">
        <slot />
    </div>

</template>


<script>
export default {

    mounted () {
        // Reference: https://github.com/fjbarrientosg/infinite-scroll
        const listElm = document.querySelector('.scroll-container')

        listElm.addEventListener('scroll', (e) => {
            if (
                listElm.scrollTop + listElm.clientHeight >=
                listElm.scrollHeight
            ) {
                this.emitInfiniteScroll()
            }
        })
    },


    methods: {
        emitInfiniteScroll () {
            this.$emit('bottomScroll')
        }
    }

}
</script>
