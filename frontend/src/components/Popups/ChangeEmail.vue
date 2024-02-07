<template>
    <div class="changeEmail">
        <h2>Change Email</h2>
        <FormKit type="form"
                 submit-label="Change Email"
                 :submit-attrs="{ 'button-type': 'primary' }"
                 @submit="changeEmail">
            <FormKit type="email"
                     label="New Email"
                     v-model="newData.newEmail"
                     :autocomplete="data.account === account.account.id ? 'email' : 'off'" />
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
                newEmail: "",
            },
            response: "",
        };
    },
    methods: {
        async changeEmail() {
            const verificationData = await this.popups.addPopup("Verify", { async: true });
            const loadingPopup = await this.popups.addPopup("Loader");

            const updatingSelf = this.data.account === this.account.account.id;

            const response = await this.account.fetch("/user/email", {
                method: "PATCH",
                body: JSON.stringify({
                    user: {
                        email: this.newData.newEmail,
                        account: this.data.account,
                    },
                    verification: verificationData,
                }),
            });
            this.popups.closePopup(loadingPopup.id);

            if (!response.success) {
                this.popups.addPopup("Information", {
                    title: `Error updating ${updatingSelf ? "your" : "their"} email`,
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
                    title: `Successfully updated ${updatingSelf ? "your" : "their"} email`,
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
