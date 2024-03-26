import { createApp } from "vue";
import { createPinia } from "pinia";
import { plugin, defaultConfig } from "@formkit/vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
    faList,
    faGear,
    faRightFromBracket,
    faMoon,
    faSun,
    faPencil,
    faTrashCan,
    faX,
    faCheck,
    faFileArrowUp,
    faFile,
    faUpload,
    faDownload,
    faEllipsisVertical,
    faMagnifyingGlass,
    faArrowsRotate,
    faEye,
    faEyeSlash,
    faClipboard,
    faSortDown,
    faUsers,
    faCirclePlus,
    faQrcode,
    faUser,
    faEnvelope,
    faKey,
    faCircleInfo,
    faWrench,
    faCopy,
} from "@fortawesome/free-solid-svg-icons";
import VueObserveVisibility from "vue3-observe-visibility";
import ContextMenu from "@imengyu/vue3-context-menu";
import Loader from "./components/Loader.vue";

import router from "./router";
import App from "./App.vue";

const pinia = createPinia();

library.add(
    faList,
    faGear,
    faRightFromBracket,
    faMoon,
    faSun,
    faPencil,
    faTrashCan,
    faX,
    faCheck,
    faFileArrowUp,
    faFile,
    faUpload,
    faDownload,
    faEllipsisVertical,
    faMagnifyingGlass,
    faArrowsRotate,
    faEye,
    faEyeSlash,
    faClipboard,
    faSortDown,
    faUsers,
    faCirclePlus,
    faQrcode,
    faUser,
    faEnvelope,
    faKey,
    faCircleInfo,
    faWrench,
    faCopy,
);

const app = createApp(App);
app.use(router);
app.use(pinia);
app.component("FontAwesomeIcon", FontAwesomeIcon);
app.component("Loader", Loader);
app.use(plugin, defaultConfig);
app.use(VueObserveVisibility);
app.use(ContextMenu);
app.mount("#app");
