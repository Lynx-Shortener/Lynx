<template>
	<div class="changePassword">
		<h2>Change Password</h2>
		<FormKit type="form" :actions="false" @submit="changePassword">
			<FormKit type="password" label="Current Password" v-model="newData.password" autocomplete="current-password" />
			<FormKit type="password" label="New Password" v-model="newData.newPassword" autocomplete="new-password" />
			<FormKit type="password" label="New Password Confirmation" v-model="newData.newPasswordConfirmation" autocomplete="new-password" />
			<FormKit type="submit" label="Change Password" primary />
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
			newData: {
				password: "",
				newPassword: "",
				newPasswordConfirmation: "",
			},
			response: "",
		};
	},
	methods: {
		async changePassword() {
			const { password, newPassword } = this.newData;
			const response = await this.account.fetch("/auth/password", {
				method: "PATCH",
				body: JSON.stringify({
					password,
					newPassword,
				}),
			});

			if (!response.success) {
				this.popups.addPopup("Information", {
					title: "Error updating your password",
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
				this.account.account = response.result.account;
				this.popups.closeSelf(this);
				this.popups.addPopup("Information", {
					title: "Successfully updated your password",
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
