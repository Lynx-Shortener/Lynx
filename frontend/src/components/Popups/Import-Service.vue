<template>
    <div class="import">
        <h2>Select your service to import</h2>
        <FormKit type="radio" :options="services" v-model="service" />
        <div class="buttons">
            <FormKit type="button"
                     label="Next"
                     button-type="primary"
                     :disabled="!service"
                     @click="next" />
        </div>
    </div>
</template>

<script>
import { usePopups } from "../../stores/popups";

export default {
    data() {
        return {
            service: "",
            services: ["Shlink", "YOURLS", "Lynx"],
            popups: usePopups(),
        };
    },
    methods: {
        next() {
            this.popups.addPopup("Import", { service: this.service });
        },
    },
};
</script>

<style lang="scss" scoped>
.import {
    :deep(.formkit-outer[data-type="radio"]) {
        width: max-content;
        margin: 2rem auto;
    }
}
</style>
