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
      console.log(email)
      return auth.signInWithEmailAndPassword(email, password)
    },
    init() {
      // initialise the firestore listeners in required vuex modules
      console.log("Init")
    }
  },
};