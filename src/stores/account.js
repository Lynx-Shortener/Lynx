import { defineStore } from "pinia";

export const useAccountStore = defineStore("account", {
	state: () => {
		let token;
		function getCookie(name) {
			const value = `; ${document.cookie}`;
			const parts = value.split(`; ${name}=`);
			if (parts.length === 2) return parts.pop().split(";").shift();
		}

		token = getCookie("token");

		return {
			account: null,
			token,
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
				this.token = data.result.token;
				// expire in 7 days
				var expires = new Date(Date.now() + 86400 * 1000).toUTCString();
				document.cookie = `token=${this.token};expires=${expires};path=/;SameSite=Strict; Secure;`;
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
				this.account = data.result.account;
			}
		},
		async fetch(url, { body, headers, method, query }) {
			headers = Object.assign(headers || {}, {
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.token}`,
			});

			const response = await fetch(`/api${url}`, {
				method: method || "GET",
				headers,
				body,
				query,
			});

			const data = await response.json();

			return data;
		},
	},
});
