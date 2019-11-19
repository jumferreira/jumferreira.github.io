import Vue from 'vue';
import _axios from 'axios';
import _lodash from 'lodash';
import VModal from 'vue-js-modal';

window.axios = _axios;
window._ = _lodash;

import App from './components/App.vue';

Vue.use(VModal);
Vue.component('app', App);

new Vue({
    el: '#app',
});


