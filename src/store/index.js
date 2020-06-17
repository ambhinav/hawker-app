import Vue from "vue";
import Vuex from "vuex";
import feedback from './feedback';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    feedback
  }
});
