import { defineStore } from "pinia";
import { v4 } from "uuid";
import { shallowRef, defineAsyncComponent } from "vue";

export const usePopups = defineStore("popup", {
    state: () => ({
        popups: [],
    }),
    actions: {
        addPopup(popup, data) {
            let resolvePromise;
            let promise;

            if (data?.async) {
                promise = new Promise((resolve) => {
                    resolvePromise = resolve;
                });
            }

            let component;

            if (popup !== "Loader") component = shallowRef(defineAsyncComponent(() => import(`../components/Popups/${popup}.vue`)));

            const popupData = {
                id: v4(),
                component,
                loaded: false,
                data: data || {},
                resolve: resolvePromise,
                name: popup,
            };
            this.popups.push(popupData);

            return data?.async ? promise : popupData;
        },
        setLoaded(id) {
            const popup = this.popups.findIndex((popup) => popup.id === id);

            this.popups[popup].loaded = true;
        },
        closePopup(id, data) {
            const popupIndex = this.popups.findIndex((popup) => popup.id === id);

            if (popupIndex !== -1) {
                const popup = this.popups[popupIndex];

                if (popup.resolve) popup.resolve(data);

                this.popups.splice(popupIndex, 1);
            } else {
                console.error(`Popup with ID ${id} not found.`);
            }
        },
        closeTopmost() {
            if (this.popups.length > 0) {
                const lastPopup = this.popups[this.popups.length - 1];
                this.closePopup(lastPopup.id);
            }
        },
        closeAll() {
            const popupIDs = this.popups.map((popup) => popup.id);
            popupIDs.map((id) => {
                this.closePopup(id);
                return false;
            });
        },
        closeSelf(a, data) {
            this.closePopup(a.$el.attributes.id.value, data);
        },
    },
});
