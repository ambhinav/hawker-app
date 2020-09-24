import Vue from "vue";
import Vuex from "vuex";
import root from "./modules/root";
import feedback from "./modules/feedback";
import menu from "./modules/menu";
import markets from './modules/markets';
import stores from './modules/stores';;
import cart from './modules/cart';
import orders from './modules/orders';
import contact from './modules/contact';
import promos from './modules/promos';
import expenses from './modules/expenses';
import createCache from 'vuex-cache';

Vue.use(Vuex);

const store =  new Vuex.Store({
  plugins: [createCache()],
  modules: {
    menu,
    root,
    feedback,
    markets,
    stores,
    cart,
    orders,
    contact,
    promos,
    expenses
  }
});

export default store;