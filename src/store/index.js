import Vue from "vue";
import Vuex from "vuex";
import root from "./modules/root";
import feedback from "./modules/feedback";
import markets from './modules/markets';
import stores from './modules/stores';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    root,
    feedback,
    markets,
    stores
  }
});
