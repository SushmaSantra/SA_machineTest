import Vue from 'vue'
import App from './App.vue'
import config from '../public/js/config'

/*CONFIG */
console.log("config: ", config);
Vue.prototype.$config = Vue['$config'] = window.config = config;
Vue.prototype.$appName = 'My App'

import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

// import VeeValidate from 'vee-validate';
// Vue.use(VeeValidate);

import Plugin from '@/plugins';
Vue.use(Plugin);



/*APP STYLES*/
import "@/assets/css/common.scss";


/*REST SETTING*/
const servertype = config.jsonserver ? 'jsonserver' : 'apiserver'
const baseurl = config.jsonserver ? config.JREST : config.NREST
const resturl = config.REST
import REST from "@/utils/REST";
window.REST = Vue.$REST = Vue.prototype.$REST = REST({ baseurl: baseurl, resturl:resturl, servertype: servertype });
window.app_process = process.env.NODE_ENV === 'development' ? "development" : "production";




Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
