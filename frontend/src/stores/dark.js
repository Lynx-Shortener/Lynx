import { defineStore } from "pinia";

export const useDarkMode = defineStore("dark", {
    state: () => {
        let dark;

        if (localStorage.getItem("dark") !== null) {
            dark = localStorage.getItem("dark") === "true";
        } else {
            dark = (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) || false;
        }

        if (dark) document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");

        return {
            dark,
        };
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
