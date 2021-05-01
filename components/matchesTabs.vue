<template>
    <div class="tabs">
        <a-tabs default-active-key="1" class="tabPane" size="large">
            <a-tabPane key="1" :tab="title1">
                <CollapseBtn
                    secondary-tab-title="INDIVIDUAL"
                    total-team-request="2"
                    total-individual-request="2"
                    type="matches"
                />
            </a-tabPane>
            <a-tabPane key="2" :tab="title2">
                <CollapseBtn
                    secondary-tab-title="INDIVIDUAL"
                    total-team-request="2"
                    total-individual-request="2"
                    type="requestMatches"
                />
            </a-tabPane>
        </a-tabs>
    </div>
</template>

<script>
export default {
    props: {
        title1: {
            type: String,
            default: "Tab1",
        },
        title2: {
            type: String,
            default: "Tab2",
        },
    },
    methods: {
        click() {
            console.log("Probando click de listDisplay para el chat");
        },
    },
};
</script>
