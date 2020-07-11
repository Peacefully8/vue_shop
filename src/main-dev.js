import Vue from 'vue'
import App from './App.vue'
import router from './router'
import "./plugs/element.js"
import 'element-ui/lib/theme-chalk/index.css'


//导入阿里图标的样式表
import "./assets/fonts/iconfont.css"

//导入nprogress进度条效果
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

//导入axios请求网络的框架
import axios from "axios"
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem("token");
  NProgress.start();
  return config;
})
axios.interceptors.response.use(config => {
  NProgress.done();
  return config;
})
Vue.prototype.$http = axios

//文本编辑器导入
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor, /* { default global options } */)


Vue.config.productionTip = false

//树形控件
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
