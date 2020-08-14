import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import SignIn from "@/views/SignIn";
import ClientContact from "@/views/Contact";
import ClientContactSuccess from "@/views/ContactSuccess";
import StoreUser from "@/views/StoreUser";
import OrderDetails from "@/views/OrderDetails";
import Invoice from "@/views/Invoice";
import Orders from "@/views/admin/Orders";
import Stores from "@/views/admin/Stores";
import Onboarding from "@/views/admin/Onboarding";
import EditMenu from '@/components/admin/EditMenu';
import AdminContact from '@/views/admin/AdminContact';
import Promos from '@/views/admin/Promos';
import { auth } from "@/firebase/init";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { title: "Home - Foodboys" }
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
    meta: { title: "About - Foodboys" }
  },
  {
    path: "/store",
    name: "StoreUser",
    component: StoreUser,
    props: (route) => ({
      ...route.params
    }),
    meta: { title: "Stores - Foodboys" }
  },
  {
    path: "/checkout",
    name: "OrderDetails",
    component: OrderDetails,
    meta: { title: "Checkout - Foodboys" }
  },
  {
    path: "/invoice",
    name: "Invoice",
    component: Invoice,
    meta: { title: "Invoice - Foodboys" }
  },
  {
    path: "/contact",
    name: "ClientContact",
    component: ClientContact,
    meta: { title: "Contact - Foodboys" }
  },
  {
    path: "/contact/success",
    name: "ClientContactSuccess",
    component: ClientContactSuccess,
    meta: { title: "Thank you" }
  },
  {
    path: "/login",
    name: "SignIn",
    component: SignIn,
    meta: {
      layout: "AuthLayout",
      title: "Foodboys Admin"
    },
  },
  {
    path: "/admin",
    component: Orders,
    meta: {
      layout: "AdminLayout",
      requiresAuth: true,
      title: "Admin - Orders"
    },
  },
  {
    path: "/admin/stores",
    component: Stores,
    meta: {
      layout: "AdminLayout",
      requiresAuth: true,
      title: "Admin - Stores"
    },
  },
  {
    path: "/admin/stores/:id",
    name: "EditMenu",
    component: EditMenu,
    meta: {
      layout: "AdminLayout",
      requiresAuth: true,
      title: "Admin - Menu"
    },
  },
  {
    path: "/admin/onboarding",
    component: Onboarding,
    meta: {
      layout: "AdminLayout",
      requiresAuth: true,
      title: "Admin - Onboard"
    },
  },
  {
    path: "/admin/contact",
    component: AdminContact,
    meta: {
      layout: "AdminLayout",
      requiresAuth: true,
      title: "Admin - Contact"
    },
  },
  {
    path: "/admin/promos",
    component: Promos,
    meta: {
      layout: "AdminLayout",
      requiresAuth: true,
      title: "Admin - Promos"
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

router.afterEach((to) => {
  Vue.nextTick(() => {
    document.title = to.meta.title
  })
})

export default router;
