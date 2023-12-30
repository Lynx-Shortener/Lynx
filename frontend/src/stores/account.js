import { defineStore } from "pinia";
import { usePopups } from "./popups";

export const useAccountStore = defineStore("account", {
    state: () => {
        let preferences = {
            reducedPopups: false,
        };
        if (localStorage.getItem("preferences")) {
            preferences = JSON.parse(localStorage.getItem("preferences"));
        }
        return {
            account: null,
            preferences,
        };
    },
    actions: {
        updatePreference(preference, value) {
            this.preferences[preference] = value;

            localStorage.setItem("preferences", JSON.stringify(this.preferences));
        },
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
        async fetch(url, {
            body, headers: providedHeaders, method, query, contentType,
        }) {
            let defaultHeaders = {};

            if (contentType !== false) {
                defaultHeaders = {
                    "Content-Type": contentType || "application/json",
                    ...defaultHeaders,
                };
            }

            const headers = Object.assign(defaultHeaders, providedHeaders || {});

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
        async logout() {
            await this.fetch("/auth/me", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            document.location.reload();
        },
        async newSecret({ id: userID }) {
            const popups = usePopups();
            const data = await this.fetch("/auth/newSecret", {
                method: "POST",
                body: JSON.stringify({ userID }),
            });

            if (!data.success) {
                popups.addPopup("Information", {
                    title: "Error generating new secret",
                    description: data.message,
                    buttons: [
                        {
                            name: "Okay",
                            type: "primary",
                            action: "return",
                        },
                    ],
                });
                return;
            }

            if (this.account.id === userID || !userID) {
                this.account.secret = data.result.secret;
            }

            return data.result.secret;
        },
    },
});
