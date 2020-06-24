import { auth } from '@/firebase/init';
import { getDistanceFromLatLonInKm, getCurrentLocation } from '@/utils/distanceCalculator';

export default {
  state: {
    location: {}
  },
  getters: {
  },
  mutations: {
    setLocation: (state, location) => state.location = { ...location }
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
      dispatch("getLocation")
      dispatch("initStores");
      dispatch("initMarkets");
      dispatch("initMenu");
    },
    async getLocation({ commit }) {
      try {
        var location = await getCurrentLocation();
        commit('setLocation', location);
      } catch (err) {
        console.log(err)
      }
    },
    async getDistance({ state }, { lat, lng }) {
      try {
        var currLocation = state.location;
        var d = getDistanceFromLatLonInKm(
          lat,
          lng,
          currLocation.latitude,
          currLocation.longitude,
        )
        return d.toFixed(1);
      } catch(err) {
        console.log(err)
      }
    }
  },
};