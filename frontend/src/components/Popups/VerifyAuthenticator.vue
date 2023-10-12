<template>
    <div class="verify">
        <h2>Set your WebAuthn authenticator's name</h2>
        <FormKit
            type="form"
            submit-label="Verify"
            :submit-attrs="{ 'button-type': 'primary' }"
            @submit="verify"
        >
            <FormKit
                v-model="name"
                type="text"
                label="Authenticator Name"
                validation="alphanumeric|required|length:3,30"
            />
            <p>{{ response }}</p>
        </FormKit>
    </div>
</template>

<script>
import { useAccountStore } from "../../stores/account";
import { usePopups } from "../../stores/popups";

export default {
    props: ["data"],
    data() {
        return {
            account: useAccountStore(),
            popups: usePopups(),
            name: "",
            response: "",
        };
    },
    methods: {
        async verify() {
            const verificationResponse = await this.account.fetch("/webauthn/register/verify", {
                method: "POST",
                body: JSON.stringify({
                    name: this.name,
                    attpResp: this.data.attResp,
                }),
            });

            if (verificationResponse.success) {
                this.popups.addPopup("Information", {
                    title: "WebAuthn authenticator successfully added",
                    buttons: [
                        {
                            name: "Okay",
                            type: "primary",
                            action: "close-all",
                        },
                    ],
                });
            } else {
                this.popups.addPopup("Information", {
                    title: "Error when adding a new WebAuthn authenticator",
                    description: verificationResponse.message,
                    buttons: [
                        {
                            name: "Cancel",
                            type: "primary",
                            action: "return",
                        },
                    ],
                });
            }
        },
    },
};
</script>
