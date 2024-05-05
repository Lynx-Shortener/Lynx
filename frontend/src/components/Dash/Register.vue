<template>
    <div class="register">
        <h2>Register</h2>
        <FormKit
            type="form"
            submit-label="Register"
            :submit-attrs="{ 'button-type': 'primary' }"
            @submit="register"
        >
            <FormKit
                name="username"
                type="text"
                label="Username"
                help="Alphanumeric, underscores and periods allowed but not at the start or end of the username."
                :validation="[['required'], ['matches', /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/]]"
                :validation-messages="{
                    matches: 'Username does not match requirements.',
                }"
                :errors="errors.username"
            />
            <FormKit
                name="email"
                type="email"
                label="Email"
                validation="required:trim"
                :errors="errors.email"
            />
            <FormKit
                type="password"
                name="password"
                label="Password"
                help="At least 1 lowercase, 1 uppercase, 1 number and 1 special character. Minimum of 12 characters"
                :validation="[['required'], ['matches', /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)(?!.* ).{12,}$/]]"
                :validation-messages="{
                    matches: 'Password does not match requirements.',
                }"
                :errors="errors.password"
            />
            <FormKit
                type="password"
                name="password_confirm"
                label="Confirm password"
                validation="required|confirm:password"
                validation-label="Password confirmation"
            />
        </FormKit>
        <p>{{ response }}</p>
        <a @click="gotoLogin">Already have an account? Log in</a>
    </div>
</template>

<script>
import { useAbout } from "../../stores/about";
import { useAccountStore } from "../../stores/account";

export default {
    data() {
        return {
            about: useAbout(),
            errors: {
                username: [],
                password: [],
                email: [],
            },
            response: null,
        };
    },
    methods: {
        async register(request) {
            this.errors = {
                username: [],
                password: [],
                email: [],
            };
            this.response = null;
            const account = useAccountStore();
            const data = await account.register(request);
            if (data.success) {
                this.about.track("Account Registered");
                this.response = "Registered!";
                if (this.$route.query.next) return this.$router.push(decodeURIComponent(this.$route.query.next));
                this.$router.push({
                    path: "/dash/login",
                    query: this.$route.query,
                });
            } else if (data.message === "Field(s) are already used") {
                Object.keys(data.details.exists)
                    .filter((field) => data.details.exists[field])
                    .forEach((field) => {
                        this.errors[field] = [`This ${field} already exists`];
                    });
                console.log(this.errors);
            } else if (data.message === "Invalid field(s)") {
                Object.keys(data.details.invalid)
                    .filter((field) => data.details.invalid[field])
                    .forEach((field) => {
                        this.errors[field] = [`This ${field} does not match the criteria`];
                    });
                console.log(this.errors);
            } else {
                this.response = data.message;
            }
        },
        gotoLogin() {
            this.$router.push({
                path: "/dash/login",
                query: this.$route.query,
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.register {
    display: flex;
    justify-content: center;
    flex-direction: column;
    min-height: 100%;
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
    @media screen and (max-width: 768px) {
        min-height: 100vh;
        padding-block: 2rem;
    }
}
</style>
