import { defineStore } from "pinia";
import { useConfig } from "./config";
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
			const config = useConfig();
			const response = await fetch("/api/auth/login", {
				method: "POST",
				body: JSON.stringify(logindata),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await response.json();

			// expire in an hour if demo, 7 days if not demo
			const expiryTime = config.data.demo ? 3600 * 1000 : 86400 * 1000 * 7;

			if (data.success) {
				this.token = data.result.token;
				var expires = new Date(Date.now() + expiryTime).toUTCString();
				document.cookie = `token=${this.token};expires=${expires};path=/;SameSite=Strict; Secure;`;
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
			let defaultHeaders = {
				Authorization: `Bearer ${this.token}`,
			};

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
			document.cookie = `token=${this.token};expires=${new Date(0).toUTCString()};path=/; SameSite=Strict; Secure;`;
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
