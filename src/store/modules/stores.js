import { db, storage } from "@/firebase/init";

export default {
  state: {
    stores: []
  },
  mutations: {
    //CRUD for stores
    setStores(state, payload) {
      if (!state.stores.find(store => store.id == payload.store.id)) {
        state.stores.push(payload.store);
      }
    },
    /*
    replaceItem(state, payload) {
      state.stores = state.stores.filter(store => {
        return store.id != payload.store.id;
      });
      if (!state.stores.find(store => store.id == payload.store.id)) {
        state.stores.push(payload.store);
      }
    },
    */
    resetStores(state) {
      state.stores = [];
    }
  },
  actions: {
    resetStores(context){
      context.commit('resetStores')
    },
    initStores(context) {
      db.collection("Stores")
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            var doc = change.doc;
            var storeData = doc.data();
            storeData.id = doc.id;
            console.log("Store: ", storeData.id);
            if (change.type == "added") {
              context.commit("setStores", {
                store: storeData
              });
            }
            // if (change.type == "modified") {
            //   context.commit("replaceItem", {
            //     store: storeData
            //   });
            // }
            // if (change.type == "removed") {
            //   context.commit("removeItem", {
            //     store: storeData
            //   });
            // }
          });
        });
		},
    async createStore({ dispatch, getters }, store) {
      var targetMarket = getters.getMarkets.find(market => market.id === store.marketId)
      let storeId
      if (Object.prototype.hasOwnProperty.call(targetMarket, "stores")) {
        storeId = `${store.marketId}-${targetMarket.stores.length + 1}`;
      } else {
        storeId = `${store.marketId}-1`;
      }
      await db.collection("Stores")
        .doc(storeId)
        .set({
          name: store.name,
          deliveryTimings: store.deliveryTimings,
          operatingTimes: store.operatingTimes,
          pocName: store.pocName,
          pocContact: store.pocContact,
          image: null,
          enabled: true
        })
      await dispatch('uploadStorePic', { image: store.image, storeId })
      return dispatch("addStoreToMarket", { 
        marketId: store.marketId,
        storeId: storeId
      })
    },
    uploadStorePic(context, { image, storeId }) {
      var storageRef = storage.ref()
      var storePic = storageRef.child("/storePics/"+storeId+".jpg")
      return storePic
      .put(image)
      .then(snapshot => {
        snapshot.ref.getDownloadURL()
        .then((downloadURL) => {
          return db.collection('Stores')
            .doc(storeId)
            .update({
              image: downloadURL
            })
        })
      })
    },
  },
  getters: {
    getStores: state => {
      return state.stores;
    }
  },
};