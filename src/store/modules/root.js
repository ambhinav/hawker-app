import { auth } from '@/firebase/init';

export default {
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
    logIn(context, { email, password }) {
      return auth.signInWithEmailAndPassword(email, password)
    },
    logOut() {
      return auth.signOut()
    },
    init({ dispatch }) {
      // initialise firestore listeners in markets, stores and orders modules
      console.log("Init");
      dispatch("initMarkets");
      dispatch("initStores");
    }
  },
};