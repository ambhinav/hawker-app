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
    init() {
      // initialise the firestore listeners in required vuex modules
      console.log("Init")
    }
  },
};