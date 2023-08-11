<template>
    <div class="login">
        <h2>Login</h2>
        <FormKit
            type="form"
            submit-label="Login"
            :submit-attrs="{ 'button-type': 'primary' }"
            @submit="login"
        >
            <FormKit
                v-model="logindata.username"
                type="text"
                label="Your username"
                validation="required:trim"
                autocomplete="username"
            />
            <FormKit
                v-model="logindata.password"
                type="password"
                label="Your password"
                validation="required:trim"
                autocomplete="current-password"
            />
            <FormKit
                v-if="requires2FA"
                v-model="logindata.token"
                type="text"
                label="Your 2FA token"
                validation="number:required|length:6,6"
                autocomplete="one-time-code"
            />
            <a v-if="requires2FA" class="lostTOTP" @click="lostTOTP">Lost your authenticator?</a>
            <p>{{ response }}</p>
        </FormKit>
        <a @click="gotoRegister"> Register </a>
    </div>
</template>

<script>
import { useAccountStore } from "../../stores/account";
import { useAbout } from "../../stores/about";
import { usePopups } from "../../stores/popups";

export default {
    data() {
        return {
            about: useAbout(),
            popups: usePopups(),
            logindata: {
                username: "",
                password: "",
                token: "",
            },
            response: null,
            requires2FA: false,
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
        async login() {
            this.response = null;
            const account = useAccountStore();
            const data = await account.login(this.logindata);
            if (data.success) {
                this.about.track("Logged In");
                this.response = "Logged in!";
                await this.about.load();
                if (this.$route.query.next) return this.$router.push(decodeURIComponent(this.$route.query.next));
                this.$router.push("/dash");
            } else {
                this.requires2FA = data.message === "2FA token required";
                if (!this.requires2FA) {
                    this.response = data.message;
                }
            }
        },
        gotoRegister() {
            this.$router.push({
                path: "/dash/register",
                query: this.$route.query,
            });
        },
        lostTOTP() {
            this.popups.addPopup("LostTOTP", this.logindata);
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
