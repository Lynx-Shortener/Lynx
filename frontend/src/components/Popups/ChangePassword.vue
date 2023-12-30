<template>
    <div class="changePassword">
        <h2>Change Password</h2>
        <FormKit type="form"
                 submit-label="Change Password"
                 :submit-attrs="{ 'button-type': 'primary' }"
                 @submit="changePassword">
            <FormKit type="password"
                     name="password"
                     label="New Password"
                     v-model="newData.newPassword"
                     autocomplete="new-password"
                     help="At least 1 lowercase, 1 uppercase, 1 number and 1 special character. Minimum of 12 characters"
                     :validation="[['required'], ['matches', /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{12,}$/]]" />
            <FormKit type="password"
                     label="New Password Confirmation"
                     v-model="newData.newPasswordConfirmation"
                     autocomplete="new-password"
                     validation="required|confirm:password" />
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
                newPassword: "",
                newPasswordConfirmation: "",
                token: "",
            },
            response: "",
        };
    },
    methods: {
        async changePassword() {
            const verificationData = await this.popups.addPopup("Verify", { async: true });
            const loadingPopup = await this.popups.addPopup("Loader");

            const updatingSelf = this.data.account === this.account.account.id;

            const response = await this.account.fetch("/user/password", {
                method: "PATCH",
                body: JSON.stringify({
                    user: {
                        password: this.newData.newPassword,
                        account: this.data.account,
                    },
                    verification: verificationData,
                }),
            });

            this.popups.closePopup(loadingPopup.id);

            if (!response.success) {
                this.popups.addPopup("Information", {
                    title: `Error updating ${updatingSelf ? "your" : "their"} password`,
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
                    title: `Successfully updated ${updatingSelf ? "your" : "their"} password`,
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
