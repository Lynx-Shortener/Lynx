<template>
    <div class="changeUsername">
        <h2>Change Username</h2>
        <FormKit type="form"
                 submit-label="Change Username"
                 :submit-attrs="{ 'button-type': 'primary' }"
                 @submit="changeUsername">
            <FormKit type="text"
                     label="New Username"
                     v-model="newData.username"
                     :autocomplete="data.account === account.account.id ? 'username' : 'off'" />
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
            newData: {
                username: "",
            },
            response: "",
        };
    },
    methods: {
        async changeUsername() {
            const verificationData = await this.popups.addPopup("Verify", { async: true });
            const loadingPopup = await this.popups.addPopup("Loader");

            const updatingSelf = this.data.account === this.account.account.id;

            const response = await this.account.fetch("/user/username", {
                method: "PATCH",
                body: JSON.stringify({
                    user: {
                        username: this.newData.username,
                        account: this.data.account,
                    },
                    verification: verificationData,
                }),
            });

            this.popups.closePopup(loadingPopup.id);

            if (!response.success) {
                this.popups.addPopup("Information", {
                    title: `Error updating ${updatingSelf ? "your" : "their"} username`,
                    description: response.message,
                    buttons: [
                        {
                            name: "Retry",
                            type: "primary",
                            action: "return",
                        },
                        {
                            name: "Cancel",
                            type: "secondary",
                            action: "close-all",
                        },
                    ],
                });
            } else {
                if (updatingSelf) this.account.account = response.result.account;

                this.popups.closeSelf(this, { account: response.result.account });
                if (this.account.preferences.reducedPopups) return;
                this.popups.addPopup("Information", {
                    title: `Successfully updated ${updatingSelf ? "your" : "their"} username`,
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
