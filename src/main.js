import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import store from './store'
import router from './router'
import './assets/css/main.css'
import VueTheMask from 'vue-the-mask'
import './plugins/axios'


Vue.config.productionTip = false;
Vue.use(VueTheMask);

const moment = require('moment-timezone');
Vue.prototype.$moment = moment;
Vue.use(moment)

new Vue({
    vuetify,
    router,
    store,
    render: (h) => h(App),
}).$mount("#app");