import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login = () => import("../views/Login/Login.vue")
const Home = () => import("../views/Home/Home.vue")

const routes = [{
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: "/home",
    component: Home
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach( (to,from,next) => {
  if(to.path === "/login") return next();
  if(window.sessionStorage.getItem("token")){
    next();
  }else {
    return next("/login")
  }
})

export default router
