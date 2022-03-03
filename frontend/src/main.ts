// @ts-ignore
import { BootstrapVue } from 'bootstrap-vue';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import Vue from 'vue';
import axios, { Axios } from 'axios';
import App from './App.vue';
import store from './store';
import router from './router';

Vue.use(BootstrapVue);

Vue.config.productionTip = false;

Vue.prototype.$http = axios;
Vue.prototype.$http.defaults.headers.common.Authorization = '';
Vue.prototype.$http.defaults.baseURL = process.env.VUE_APP_BASE_URL;

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount('#app');
