import { defineStore } from "pinia";

export const useAccountStore = defineStore("account", {
	state: () => {
		let token;
		return {
			account: null,
			token: null,
		};
	},
	actions: {
		async login(logindata) {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				body: JSON.stringify(logindata),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await response.json();

			if (data.success) {
				this.token = data.data.token;
				await this.getAccount();
			}

			return data;
		},
		async getAccount() {
			const response = await fetch("/api/auth/me", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.token}`,
				},
			});
			const data = await response.json();
			if (data.success) {
				this.account = data.data.account;
			}
		},
	},
});
