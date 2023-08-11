import { defineStore } from "pinia";

export const useAbout = defineStore("about", {
    state: () => ({
        data: {},
    }),
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
        track(event) {
            if (this.data.umami) {
                if (window.umami) {
                    if (window.umami.track) {
                        window.umami.track(event);
                    } else {
                        console.log("Umami is itilialised, but cannot create events. Try updating your Umami instance");
                    }
                } else {
                    console.log("Umami is configured but is not being loaded.");
                }
            }
        },
        addLink() {
            this.data.links += 1;
        },
        removeLink() {
            this.data.links -= 1;
        },
    },
});
