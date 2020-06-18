import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import SignIn from "@/views/SignIn";
import Contact from '@/views/Contact';
import AdminHome from '@/views/admin/AdminHome';
import { auth } from "@/firebase/init";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/contact",
    name: "Contact",
    component: Contact
  },
  {
    path: "/login",
    name: "SignIn",
    component: SignIn,
    meta: {
      layout: 'AuthLayout'
    }
  },
  {
    path: "/admin",
    name: "AdminHome",
    component: AdminHome,
    meta: {
      layout: 'AuthLayout',
      requiresAuth: true
    }
  },
  {
    path: "*", //catch all other invalid URLS
    beforeEnter: (to, from, next) => {
      next({ name: "Home" });
    }
  }
];

// for user pages like merchant and payment etc, use below
/*
beforeRouteLeave (to, from, next) {
  const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
  if (answer) {
    next()
  } else {
    next(false)
  }
}
*/

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  //check to see if route requires auth
  console.log("route check!");
  if (to.matched.some(rec => rec.meta.requiresAuth)) {
    //check auth state
    auth.onAuthStateChanged(user => {
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
