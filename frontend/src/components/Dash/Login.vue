<template>
    <div class="login">
        <h2>Login</h2>
        <FormKit
            type="form"
            submit-label="Login"
            :submit-attrs="{ 'button-type': 'primary' }"
            @submit="login"
            id="login"
            ref="loginForm"
        >
            <FormKit
                name="username"
                type="text"
                label="Your username"
                validation="required:trim"
                autocomplete="username"
            />
            <FormKit
                name="password"
                type="password"
                label="Your password"
                validation="required:trim"
                autocomplete="current-password"
            />
            <FormKit
                name="token"
                type="text"
                label="Your 2FA token"
                validation="number:required|length:6,6"
                autocomplete="one-time-code"
                :suffix-icon="supportsWebAuthn ? keyIcon : ''"
                id="two-factor"
                @suffix-icon-click="twoFactorPasskey"
                v-if="requires2FA"
            />
            <a v-if="requires2FA" class="lostTOTP" @click="lostTOTP">Lost your authenticator?</a>
            <p>{{ response }}</p>
        </FormKit>
        <a @click="gotoRegister"> Register </a>
    </div>
</template>

<script>
import { browserSupportsWebAuthn, browserSupportsWebAuthnAutofill, startAuthentication } from "@simplewebauthn/browser";

import { useAccountStore } from "../../stores/account";
import { useAbout } from "../../stores/about";
import { usePopups } from "../../stores/popups";

export default {
    data() {
        return {
            about: useAbout(),
            popups: usePopups(),
            supportsWebAuthn: browserSupportsWebAuthn(),
            webAuthnResponse: false,
            webAuthnOptions: false,
            response: null,
            requires2FA: false,
            // eslint-disable-next-line max-len
            keyIcon: "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"1em\" viewBox=\"0 0 512 512\" fill=\"currentColor\"> <path d=\"M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V448h40c13.3 0 24-10.7 24-24V384h40c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zM376 96a40 40 0 1 1 0 80 40 40 0 1 1 0-80z\"/> </svg>",
        };
    },
    mounted() {
        if (this.about.data.demo) {
            this.logindata = {
                username: "demo",
                password: "demo",
            };
        }
    },
    methods: {
        async login(formValues) {
            this.response = null;
            const account = useAccountStore();
            const data = await account.login({ ...formValues, webAuthnResponse: this.webAuthnResponse });
            if (data.success) {
                this.about.track("Logged In");
                this.response = "Logged in!";
                await this.about.load();
                if (this.$route.query.next) return this.$router.push(decodeURIComponent(this.$route.query.next));
                this.$router.push("/dash");
            } else {
                this.requires2FA = data.message === "2FA required";
                this.webAuthnResponse = false;
                this.webAuthnOptions = data.result.webAuthnOptions;

                if (!this.requires2FA) {
                    this.response = data.message;
                }
            }
        },
        async twoFactorPasskey() {
            this.webAuthnResponse = await startAuthentication(this.webAuthnOptions);

            this.$formkit.submit("login");
        },
        gotoRegister() {
            this.$router.push({
                path: "/dash/register",
                query: this.$route.query,
            });
        },
        lostTOTP() {
            this.popups.addPopup("LostTOTP", this.$formkit.get("login").value);
        },
    },
};
</script>

<style lang="scss" scoped>
.login {
    display: flex;
    justify-content: center;
    flex-direction: column;
    height: 100%;
    width: 20rem;
    margin: 0 auto;
    h2 {
        font-size: 2.5rem;
        font-weight: bold;
        margin-bottom: 2rem;
    }
    > a {
        margin-top: 0.5rem;
        cursor: pointer;
    }
    :deep(.formkit-outer[data-suffix-icon="true"]) {
        .formkit-inner {
            position: relative;
            display: flex;
            gap: 0.5rem;
            .formkit-suffix-icon {
                border: 1px solid var(--bg-color-4);
                border-radius: 8px;
                display: grid;
                place-content: center;
                padding: 0.8em;
                box-sizing: border-box;
                cursor: pointer;
                color: var(--color-1);
            }
        }
    }
    .lostTOTP {
        text-align: left;
        font-size: 0.8rem;
        margin-top: 0;
        cursor: pointer;
    }
    @media screen and (max-width: 768px) {
        height: 100vh;
    }
}
</style>
