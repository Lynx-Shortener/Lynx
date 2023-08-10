<template>
    <div class="information">
        <h2>{{ data.title }}</h2>
        <qrcode-vue
            v-if="data.qrcode"
            :value="data.qrcode"
            :size="200"
            level="H"
            class="qr-code"
            :background="'transparent'"
            :foreground="dark.dark ? '#3c73e9' : '#3539a0'"
        />
        <p v-html="data.description" />
        <div class="buttons">
            <FormKit
                v-for="button in data.buttons"
                :key="button.name"
                type="button"
                :button-type="button.type"
                :label="button.name"
                @click="action(button)"
            />
        </div>
    </div>
</template>

<script>
import QrcodeVue from "qrcode.vue";
import { usePopups } from "../../stores/popups";
import { useDarkMode } from "../../stores/dark";

export default {
    components: {
        QrcodeVue,
    },
    props: ["data"],
    data() {
        return {
            popups: usePopups(),
            dark: useDarkMode(),
        };
    },
    methods: {
        action(button) {
            const runAction = (action) => {
                switch (action) {
                case "return":
                    this.popups.closeSelf(this, button);
                    break;

                case "close-all":
                    this.popups.closeAll();
                    break;

                case "refresh":
                    window.location.reload();
                    break;

                case "navigate-back":
                    window.history.back();
                    break;

                case "navigate-home":
                    this.$router.push("/dash");
                    break;

                default:
                    break;
                }
            };

            if (button.action) runAction(button.action);
            if (button.actions) button.actions.forEach((action) => runAction(action));
        },
    },
};
</script>

<style lang="scss" scoped>
.information {
    h2 {
        font-size: 2rem;
        font-weight: 500;
        margin-bottom: 1rem;
    }
    .buttons {
        margin-top: 1rem;
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 1rem;
        :deep(.formkit-outer) {
            max-width: 60%;
        }
    }
}
</style>
