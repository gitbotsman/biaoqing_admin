import Vue from 'vue'
import VeeValidate from 'vee-validate/dist/vee-validate.min'
import validators from './misc/validators'
import directives from './misc/directives'
import messages from './misc/vee-validate-messages'
import filters from './misc/filters'
import toastr from './misc/toastr.esm'
import router from './routers'
// import stylesheets
import 'tb-icons/lib/styles/tb-icons.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'
import 'jstree/dist/themes/default/style.min.css'
import '../static/themify-icons/themify-icons.css'
import '../static/css/plugins.css'
import '../static/css/style.css'

import 'sweetalert2/dist/sweetalert2.min.css'
// import javascripts
import $ from 'jquery'
import 'sweetalert/dist/sweetalert.min'
import 'bootstrap/js/src/dropdown'
import 'bootstrap/js/src/util'
import 'jstree/dist/jstree.min'




// register custom validators
Object.keys(validators).forEach(v => VeeValidate.Validator.extend(v, validators[v]))

// register custom directives
Object.keys(directives).forEach(d => Vue.directive(d, directives[d]))

// register custom filters
Object.keys(filters).forEach(d => Vue.filter(d, filters[d]))

// register custom global utility functions
// Object.assign(Vue.prototype, utils)

// register global toastr as `notice`
Vue.prototype.$notice = toastr

// prevent auto hiding when click a dropdown-menu inside `.selectize` class
$(document).on('click.bs.dropdown.data-api', '.selectize .dropdown-menu', e => e.stopPropagation())

Vue.use(VeeValidate, {
  locale: 'zhCN',
  dictionary: {
    zhCN: {messages}  // 注册VeeValidate中文提示
  }
})

new Vue({
  template: '<router-view id="app"></router-view>',
  router
}).$mount('#app')
