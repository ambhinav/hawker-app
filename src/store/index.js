import Vue from "vue";
import Vuex from "vuex";
import root from "./modules/root";
import feedback from "./modules/feedback";
import menu from "./modules/menu";
import markets from './modules/markets';
import stores from './modules/stores';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    menu,
    root,
    feedback,
    markets,
    stores
  }
});
