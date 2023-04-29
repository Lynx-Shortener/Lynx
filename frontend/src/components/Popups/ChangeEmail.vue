<template>
	<div class="changeEmail">
		<h2>Change Email</h2>
		<FormKit type="form" :actions="false" @submit="changeEmail">
			<FormKit type="email" label="New Email" v-model="newData.newEmail" />
			<FormKit type="password" label="Password" v-model="newData.password" />
			<FormKit type="text" label="Your 2FA token" v-model="newData.token" validation="number:required|length:6,6" v-if="account.account.totp"/>
			<FormKit type="submit" label="Change Email" primary />
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
				newEmail: "",
				password: "",
				token: ""
			},
			response: "",
		};
	},
	methods: {
		async changeEmail() {
			const response = await this.account.fetch("/auth/email", {
				method: "PATCH",
				body: JSON.stringify(this.newData),
			});

			if (!response.success) {
				this.popups.addPopup("Information", {
					title: "Error updating your email",
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
					title: "Successfully updated your email",
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
