import { defineStore } from "pinia";

export const useConfig = defineStore("config", {
	state: () => {
		// const config = await fetch("/api/config");
		// const data = await config.json();
		return {
			data: {},
		};
	},
	actions: {
		async load() {
			const config = await fetch("/api/config");
			const data = await config.json();

			if (data.success) {
				this.data = data.result;
			}
		},
	},
});
