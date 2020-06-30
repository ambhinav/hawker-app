import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import SignIn from "@/views/SignIn";
import Contact from "@/views/Contact";
import StoreUser from "@/views/StoreUser";
import OrderDetails from "@/views/OrderDetails";
import Invoice from "@/views/Invoice";
import Orders from "@/views/admin/Orders";
import Stores from "@/views/admin/Stores";
import Onboarding from "@/views/admin/Onboarding";
import EditMenu from '@/components/admin/EditMenu';
import { auth } from "@/firebase/init";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/store",
    name: "StoreUser",
    component: StoreUser,
    props: (route) => ({
      ...route.params
    }),
  },
  {
    path: "/checkout",
    name: "OrderDetails",
    component: OrderDetails
  },
  {
    path: "/invoice",
    name: "Invoice",
    component: Invoice
  },
  {
    path: "/contact",
    name: "Contact",
    component: Contact,
  },
  {
    path: "/login",
    name: "SignIn",
    component: SignIn,
    meta: {
      layout: "AuthLayout",
    },
  },
  {
    path: "/admin",
    component: Orders,
    meta: {
      layout: "AdminLayout",
      requiresAuth: true,
    },
  },
  {
    path: "/admin/stores",
    component: Stores,
    meta: {
      layout: "AdminLayout",
      requiresAuth: true,
    },
  },
  {
    path: "/admin/stores/:id",
    name: "EditMenu",
    component: EditMenu,
    meta: {
      layout: "AdminLayout",
      requiresAuth: true,
    },
  },
  {
    path: "/admin/onboarding",
    component: Onboarding,
    meta: {
      layout: "AdminLayout",
      requiresAuth: true,
    },
  },
  {
    path: "*", //catch all other invalid URLS
    beforeEnter: (to, from, next) => {
      next({ name: "Home" });
    },
  },
];

// for user pages like merchant and payment etc, use below
/*

*/

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  //check to see if route requires auth
  console.log("route check!");
  if (to.matched.some((rec) => rec.meta.requiresAuth)) {
    //check auth state
    auth.onAuthStateChanged((user) => {
      if (user) {
        //user signed in, proceed to route
        next();
      } else {
        //NO user signed in, redirect to login
        next({ name: "SignIn" });
      }
    });
  } else {
    next();
  }
});

export default router;
