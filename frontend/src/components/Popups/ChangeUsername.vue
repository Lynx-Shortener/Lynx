<template>
	<div class="changeUsername">
		<h2>Change Username</h2>
		<FormKit type="form" :actions="false" @submit="changeUsername">
			<FormKit type="text" label="New Username" v-model="newData.newUsername" autocomplete="username" />
			<FormKit type="password" label="Password" v-model="newData.password" autocomplete="current-password" />
			<FormKit type="submit" label="Change Username" primary />
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
				newUsername: "",
				password: "",
			},
			response: "",
		};
	},
	methods: {
		async changeUsername() {
			const { newUsername, password } = this.newData;
			const response = await this.account.fetch("/auth/username", {
				method: "PATCH",
				body: JSON.stringify({
					newUsername,
					password,
				}),
			});

			if (!response.success) {
				this.popups.addPopup("Information", {
					title: "Error updating your username",
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
					title: "Successfully updated your username",
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
