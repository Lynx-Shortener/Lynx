import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import { plugin, defaultConfig } from "@formkit/vue";

const pinia = createPinia();

var app = createApp(App);
app.use(router);
app.use(pinia);
app.use(plugin, defaultConfig);
app.mount("#app");
