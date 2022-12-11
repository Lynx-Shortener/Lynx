import { defineStore } from "pinia";

export const useDarkMode = defineStore("dark", {
	state: () => {
		let dark;

		if (localStorage.getItem("dark") !== null) {
			dark = localStorage.getItem("dark") === "true";
		} else {
			dark = this.prefersDark;
		}

		if (dark) document.documentElement.classList.add("dark");
		else document.documentElement.classList.remove("dark");

		console.log(dark);

		return {
			dark,
		};
	},
	getters: {
		prefersDark() {
			return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
		},
	},
	actions: {
		toggle() {
			this.dark = !this.dark;
			localStorage.setItem("dark", this.dark);

			if (this.dark) document.documentElement.classList.add("dark");
			else document.documentElement.classList.remove("dark");
		},
	},
});
