import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import { initDB } from "./scripts/db";

Vue.use(ElementUI);
Vue.config.productionTip = false;

initDB();

new Vue({
  render: (h) => h(App),
}).$mount("#app");
