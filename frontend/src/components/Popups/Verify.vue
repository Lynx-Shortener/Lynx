<template>
    <div class="verify">
        <h2>Verification Required</h2>
        <FormKit
            type="form"
            submit-label="Verify"
            :submit-attrs="{ 'button-type': 'primary' }"
            @submit="verify"
        >
            <FormKit
                v-if="account.account.totp"
                v-model="verification.token"
                type="text"
                label="Your 2FA token"
                validation="number:required|length:6,6"
                autocomplete="one-time-code"
            />
            <FormKit
                v-else
                v-model="verification.password"
                type="password"
                label="Password"
                autocomplete="current-password"
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
            verification: {
                token: "",
                password: "",
            },
            response: "",
        };
    },
    methods: {
        async verify() {
            this.popups.closeSelf(this, this.verification);
        },
    },
};
</script>
