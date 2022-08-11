import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./index.css";
import "./polyfills/dateFormatter";
import { createPinia } from "pinia";

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);
app.mount("#app");
