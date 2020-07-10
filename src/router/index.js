import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const Login = () => import("../views/Login/Login.vue")
const Home = () => import("../views/Home/Home.vue")
const Welcome = () => import("../components/content/Welcome/Welcome.vue")
const Users = () => import("../components/content/Users.vue")
const Rights = () => import("../components/content/Rights.vue")
const Roles = () => import("../components/content/Roles.vue")
const Categories = () => import("../components/content/Categories.vue")
const Goods = () => import("../components/content/Goods.vue")
const Params = () => import("../components/content/Params.vue")
const Orders = () => import("../components/content/Orders.vue")
const Reports = () => import("../components/content/Reports.vue")
const Add = () => import("../components/content//Goodschild/Add.vue")

//解决访问同一地址报错的问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

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
      },
      {
        path:"/categories",
        component:Categories
      },
      {
        path:"/goods",
        component:Goods
      },
      {
        path:"/params",
        component:Params
      },
      {
        path:"/orders",
        component:Orders
      },
      {
        path:"/reports",
        component:Reports
      },
      {
        path:"/goods/add",
        component:Add
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
