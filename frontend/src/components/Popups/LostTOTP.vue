<template>
    <div class="lostTOTP">
        <h2>Lost your Authenticator App?</h2>
        <p class="subheader">
            Enter one of your backup codes below to disable 2FA and get back into your account
        </p>
        <FormKit type="form"
                 submit-label="Recover Account"
                 :submit-attrs="{ 'button-type': 'primary' }"
                 @submit="recover">
            <FormKit type="text"
                     label="Your Backup Code"
                     v-model="backupCode"
                     validation="alphanumeric:required|length:12,12"
                     autocomplete="off"/>
            <p>{{ response }}</p>
        </FormKit>
    </div>
</template>

<script>
import { useAbout } from "../../stores/about";
import { useAccountStore } from "../../stores/account";
import { usePopups } from "../../stores/popups";

export default {
    props: ["data"],
    data() {
        return {
            popups: usePopups(),
            account: useAccountStore(),
            about: useAbout(),
            backupCode: "",
            response: "",
        };
    },
    methods: {
        async recover() {
            const payload = {
                username: this.data.username,
                password: this.data.password,
                backupCode: this.backupCode,
            };
            const totpResponse = await this.account.fetch("/auth/totp/recover", {
                method: "POST",
                body: JSON.stringify(payload),
            });

            if (!totpResponse.success) {
                this.response = totpResponse.message;
            } else {
                this.about.track("Account Recovered");
                this.popups.closeSelf(this);
                this.account.getAccount();
                if (this.$route.query.next) return this.$router.push(decodeURIComponent(this.$route.query.next));
                this.$router.push("/dash/settings");
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.lostTOTP {
    > h2 {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 1rem;
    }
    .subheader {
        margin-bottom: 1rem;
    }
    :deep(.formkit-outer) {
        margin: auto;
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
