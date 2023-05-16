import { defineStore } from "pinia";

export const useAbout = defineStore("about", {
	state: () => {
		return {
			data: {},
		};
	},
	actions: {
		async load() {
			const about = await fetch("/api/about");
			const data = await about.json();

			if (data.success) {
				this.data = data.result;
				return this.data;
			}

			return false;
		},
	},
});
