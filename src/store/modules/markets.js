import { db } from "@/firebase/init";
import firebase from 'firebase';

export default {
  state: {
    markets: []
  },
  mutations: {
    //CRUD for markets
    setMarkets(state, payload) {
      if (!state.markets.find(market => market.id == payload.market.id)) {
        state.markets.push(payload.market);
      }
    },
    /*
    replaceItem(state, payload) {
      state.markets = state.markets.filter(market => {
        return market.id != payload.market.id;
      });
      if (!state.markets.find(market => market.id == payload.market.id)) {
        state.markets.push(payload.market);
      }
    },
    */
    resetMarkets(state) {
      state.markets = [];
    }
  },
  actions: {
    resetMarkets(context){
      context.commit('resetMarkets');
    },
    initMarkets(context) {
      context.commit("resetMarkets");
      db.collection("Markets")
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(async change => {
            var doc = change.doc;
            var marketData = doc.data();
            marketData.id = doc.id;
            marketData.distance = await context.dispatch("getDistance", { lat: marketData.location.latitude, lng: marketData.location.longitude })
            if (change.type == "added") {
              context.commit("setMarkets", {
                market: marketData
              });
            }
            // if (change.type == "modified") {
            //   context.commit("replaceItem", {
            //     market: marketData
            //   });
            // }
            // if (change.type == "removed") {
            //   context.commit("removeItem", {
            //     market: marketData
            //   });
            // }
          });
        });
    },
    // updates the stores available inside the market
    addStoreToMarket(context, { marketId, storeId }) {
      return db.collection("Markets")
        .doc(marketId)
        .update({
          stores: firebase.firestore.FieldValue.arrayUnion(storeId)
        })
    }
  },
  getters: {
    // sort markets by their enabled status
    getMarkets: state => {
      state.markets.sort((x, y) => {
        return (x.enabled == y.enabled) ? 0 : x.enabled? -1 : 1;
      });
      return state.markets;
    }
  },
};