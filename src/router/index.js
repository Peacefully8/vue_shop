import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login = () => import("../views/Login/Login.vue")
const Home = () => import("../views/Home/Home.vue")
const Welcome = () => import("../components/content/Welcome/Welcome.vue")
const Users = () => import("../components/content/Users.vue")
const Rights = () => import("../components/content/Rights.vue")
const Roles = () => import("../components/content/Roles.vue")

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
    component: Home,
    redirect: "/welcome",
    children: [
      {
        path: "/welcome",
        component: Welcome
      },
      {
        path: "/users",
        component: Users
      },
      {
        path:"/rights",
        component:Rights
      },
      {
        path:"/roles",
        component:Roles
      }
    ]
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
