import { defineStore } from "pinia";
export const useAccountStore = defineStore("account", {
	state: () => {
		return {
			account: null,
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

			// expire in an hour if demo, 7 days if not demo

			if (data.success) {
				await this.getAccount();
			}

			return data;
		},
		async register(registerdata) {
			const response = await fetch("/api/auth/register", {
				method: "POST",
				body: JSON.stringify(registerdata),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await response.json();
			return data;
		},
		async getAccount() {
			const data = await this.fetch("/auth/me", {});

			this.account = data.success ? data.result : null;
			return this.account;
		},
		async fetch(url, { body, headers, method, query, contentType }) {
			let defaultHeaders = {};

			if (contentType !== false) {
				defaultHeaders = Object.assign(
					{
						"Content-Type": contentType || "application/json",
					},
					defaultHeaders
				);
			}

			headers = Object.assign(defaultHeaders, headers || {});

			const response = await fetch(`/api${url}`, {
				method: method || "GET",
				headers,
				body,
				query,
			});

			try {
				// fall back on text response
				const data = await response.clone().json();

				return data;
			} catch {
				const data = await response.text();
				return {
					success: response.ok,
					message: data,
				};
			}
		},
		logout() {
			this.fetch("/auth/me", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			});
			document.location.reload();
		},
		async newSecret() {
			const data = await this.fetch("/auth/newSecret", {
				method: "POST",
			});

			if (!data.success) {
				alert(data.message);
				return;
			}

			this.account.secret = data.result.secret;
			return;
		},
	},
});
