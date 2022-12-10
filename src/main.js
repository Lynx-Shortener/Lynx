import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import { plugin, defaultConfig } from "@formkit/vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faList, faGear, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import VueObserveVisibility from "vue3-observe-visibility";

const pinia = createPinia();

library.add(faList, faGear, faRightFromBracket);

var app = createApp(App);
app.use(router);
app.use(pinia);
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(plugin, defaultConfig);
app.use(VueObserveVisibility);
app.mount("#app");
