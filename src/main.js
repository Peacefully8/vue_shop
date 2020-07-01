import Vue from 'vue'
import App from './App.vue'
import router from './router'
import "./plugs/element.js"
import  'element-ui/lib/theme-chalk/index.css'

//导入阿里图标的样式表
import "./assets/fonts/iconfont.css"

//导入axios请求网络的框架
import axios from "axios"
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
axios.interceptors.request.use( config => {
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
