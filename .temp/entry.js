import Vue from 'vue'
import weex from 'weex-vue-render'
/*global Vue*/

weex.init(Vue)
/* weex initialized here, please do not move this line */
const router = require('./router');
const App = require('@/index.vue');
/* eslint-disable no-new */
var navigator = weex.requireModule('navigator')
Vue.mixin({
    methods: {
        jump(to) {
            if (this.$router) {
                this.$router.push(to)
            }
        }
    }
})
new Vue(Vue.util.extend({ el: '#root', router }, App));
router.push('/');

