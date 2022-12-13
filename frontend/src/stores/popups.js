import { defineStore } from "pinia";
import { v4 } from "uuid";
import { shallowRef, defineAsyncComponent } from "vue";

export const usePopups = defineStore("popup]", {
	state: () => {
		return {
			popups: [],
		};
	},
	actions: {
		addPopup(popup, data) {
			const component = shallowRef(defineAsyncComponent(() => import(`../components/Popups/${popup}.vue`)));
			this.popups.push({
				id: v4(),
				component,
				loaded: false,
				data,
			});
		},
		setLoaded(id) {
			const popup = this.popups.findIndex((popup) => popup.id === id);

			this.popups[popup].loaded = true;
		},
		closePopup(id) {
			this.popups = this.popups.filter((popup) => popup.id !== id);
		},
		closeTopmost() {
			this.popups.pop();
		},
		closeAll() {
			this.popups = [];
		},
		closeSelf(a) {
			this.closePopup(a.$el.attributes.id.value);
		},
	},
});
