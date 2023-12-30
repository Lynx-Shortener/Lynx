<template>
    <div class="disableTOTP">
        <h2>Disable 2FA</h2>
        <FormKit type="form"
                 submit-label="Disable 2FA"
                 :submit-attrs="{ 'button-type': 'primary' }"
                 @submit="disable">
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
import { useAbout } from "../../stores/about";
import { useAccountStore } from "../../stores/account";
import { usePopups } from "../../stores/popups";

export default {
    props: [],
    data() {
        return {
            popups: usePopups(),
            account: useAccountStore(),
            about: useAbout(),
            totpSecret: "",
            token: "",
            response: "",
        };
    },
    methods: {
        async disable() {
            const totpResponse = await this.account.fetch("/auth/totp", {
                method: "DELETE",
                body: JSON.stringify({
                    token: this.token,
                }),
            });

            if (!totpResponse.success) {
                this.response = totpResponse.message;
            } else {
                this.about.track("Disabled 2FA");
                this.account.getAccount();
                if (this.account.preferences.reducedPopups) return;
                this.popups.addPopup("Information", {
                    title: "Successfully disabled 2FA",
                    buttons: [
                        {
                            name: "Okay",
                            type: "primary",
                            action: "close-all",
                        },
                    ],
                });
            }
        },
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
