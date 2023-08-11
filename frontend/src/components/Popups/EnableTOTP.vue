<template>
    <div class="enableTOTP">
        <h2>Enable 2FA</h2>
        <qrcode-vue :value="totp.uri" level="L"/>
        <p class="totpSecret">
            {{ totp.secret }}
        </p>
        <FormKit type="form"
                 submit-label="Verify Token"
                 :submit-attrs="{ 'button-type': 'primary' }"
                 @submit="verify">
            <FormKit type="text"
                     label="Your 2FA token"
                     v-model="token"
                     validation="number:required|length:6,6"
                     autocomplete="one-time-code" />
            <p>{{ response }}</p>
        </FormKit>
    </div>
</template>

<script>
import QrcodeVue from "qrcode.vue";
import { useAccountStore } from "../../stores/account";
import { usePopups } from "../../stores/popups";
import { useAbout } from "../../stores/about";

export default {
    props: [],
    components: {
        QrcodeVue,
    },
    data() {
        return {
            popups: usePopups(),
            account: useAccountStore(),
            about: useAbout(),
            totp: {
                secret: "",
                uri: "",
            },
            token: "",
            response: "",
        };
    },
    methods: {
        async getSecret() {
            const totpResponse = await this.account.fetch("/auth/totp", {
                method: "GET",
            });

            if (!totpResponse.success) {
                this.popups.addPopup("Information", {
                    title: "Error setting up 2FA",
                    description: totpResponse.message,
                    buttons: [
                        {
                            name: "Cancel",
                            type: "primary",
                            action: "close-all",
                        },
                    ],
                });
            } else {
                this.totp = totpResponse.result;
                this.about.track("Enabled 2FA");
            }
        },
        async verify() {
            const totpResponse = await this.account.fetch("/auth/totp", {
                method: "POST",
                body: JSON.stringify({
                    token: this.token,
                }),
            });

            if (!totpResponse.success) {
                this.response = totpResponse.message;
            } else {
                this.popups.addPopup("BackupCodes", totpResponse.result);
                this.account.getAccount();
            }
        },
    },
    async mounted() {
        this.getSecret();
    },
};
</script>

<style lang="scss" scoped>
.enableTOTP {
    > h2 {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 1rem;
    }
    #qrcode {
        display: grid;
        place-content: center;
    }
    #qrcode :deep(img) {
        width: 12rem;
    }
    .totpSecret {
        font-family: monospace;
        padding: 0.2em 0.4em;
        background: var(--bg-color-2);
        border-radius: 8px;
        width: max-content;
        margin: 1rem auto;
        box-sizing: border-box;
        color: var(--color-1);
        font-size: 1rem;
    }
    :deep(.formkit-outer) {
        margin: 0 auto;
        width: 20rem;
        table {
            margin-bottom: 1rem;
            border-spacing: 5px;
            tr {
                td:nth-of-type(1) {
                    text-align: left;
                    padding-right: 0.8rem;
                    line-height: 1.4;
                    white-space: nowrap;
                }
                td:nth-of-type(2) {
                    width: 100%;
                }
            }
        }
    }
    @media screen and (max-width: 768px) {
        :deep(.formkit-form) {
            table {
                width: 100%;
                tr {
                    td {
                        display: block;
                        width: 100%;
                    }
                }
            }
        }
    }
}
</style>
