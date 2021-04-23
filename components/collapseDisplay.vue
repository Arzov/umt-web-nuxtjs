<template>
    <div class="collapseDisplay">
        <a-collapse expand-icon-position="right">
            <!-- ARROW ICON -->
            <template #expandIcon="props">
                <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
            </template>

            <!-- AVATAR PICTURE -->
            <a-avatar size="large" :src="getImage(image, icon)" />

            <!-- CONTENT -->
            <a-collapse-panel :header="label">
                <slot />
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>

<script>
export default {
    props: {
        image: { type: String, default: "" },
        icon: { type: String, default: "" },
        label: { type: String, default: "" },
    },

    methods: {
        getImage(image, icon) {
            if (image === "") return this.getIcon(icon);
            else return image;
        },
    },
};
</script>
