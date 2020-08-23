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

Vue.use(Vuex);

export default new Vuex.Store({
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
