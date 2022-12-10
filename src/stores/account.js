import { defineStore } from "pinia";

export const useAccountStore = defineStore("account", {
	state: () => {
		return {
			account: null,
		};
	},
	actions: {
		test() {
			return "ok";
		},
	},
});
