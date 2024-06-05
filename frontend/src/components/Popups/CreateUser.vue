<template>
    <div class="createUser">
        <h2>Create User</h2>
        <FormKit
            type="form"
            submit-label="Create User"
            :submit-attrs="{ 'button-type': 'primary' }"
            @submit="createUser"
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
            <FormKit
                type="checkbox"
                name="options"
                label="Options"
                :options="[
                    {
                        value: 'admin',
                        label: 'Admin',
                        attrs: { disabled: account.account.role !== 'owner' },
                        help: account.account.role !== 'owner' ? 'You need to be the owner to create admin users.' : false
                    }]"
            />
            <p>{{ response }}</p>
        </FormKit>
    </div>
</template>

<script>
import { useAccountStore } from "../../stores/account";
import { usePopups } from "../../stores/popups";

export default {
    data() {
        return {
            account: useAccountStore(),
            popups: usePopups(),
            errors: {
                username: [],
                email: [],
                password: [],
                role: [],
            },
            role: "",
            response: "",
        };
    },
    methods: {
        async createUser(data) {
            const {
                username, email, password, options,
            } = data;

            const userData = {
                username,
                email,
                password,
                role: options.includes("admin") ? "admin" : "standard",
            };

            const verificationData = await this.popups.addPopup("Verify", { async: true });
            const loadingPopup = await this.popups.addPopup("Loader");

            const response = await this.account.fetch("/user", {
                method: "POST",
                body: JSON.stringify({
                    user: userData,
                    verification: verificationData,
                }),
            });

            this.popups.closePopup(loadingPopup.id);

            if (!response.success) {
                if (response.message === "Field(s) are already used") {
                    Object.keys(response.details.exists)
                        .filter((field) => response.details.exists[field])
                        .forEach((field) => {
                            this.errors[field] = [`This ${field} already exists`];
                        });
                    console.log(this.errors);
                } else if (response.message === "Invalid field(s)") {
                    Object.keys(response.details.invalid)
                        .filter((field) => response.details.invalid[field])
                        .forEach((field) => {
                            this.errors[field] = [`This ${field} does not match the criteria`];
                        });
                    console.log(this.errors);
                } else {
                    this.response = response.message;
                }
                return;
            }

            this.popups.closeSelf(this, { success: true });
        },
    },
};
</script>
