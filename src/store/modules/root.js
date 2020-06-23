import { auth } from '@/firebase/init';
import { getDistanceFromLatLonInKm, getCurrentLocation } from '@/utils/distanceCalculator';

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
      dispatch("initMenu")
    },
    async getDistance(context, { lat, lng }) {
      try {
        var currLocation = await getCurrentLocation();
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