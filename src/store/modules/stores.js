import { db, storage } from "@/firebase/init";
import firebase from 'firebase';

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
    replaceStore(state, payload) {
      state.stores = state.stores.filter(store => {
        return store.id != payload.store.id;
      });
      if (!state.stores.find(store => store.id == payload.store.id)) {
        state.stores.push(payload.store);
      }
    },
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
            if (change.type == "modified") {
              context.commit("replaceStore", {
                store: storeData
              });
            }
            // if (change.type == "removed") {
            //   context.commit("removeItem", {
            //     store: storeData
            //   });
            // }
          });
        });
		},
    async createStore({ dispatch }, store) {
      // var targetMarket = getters.getMarkets.find(market => market.id === store.marketId)
      // let storeId
      // if (Object.prototype.hasOwnProperty.call(targetMarket, "stores")) {
      //   storeId = `${store.marketId}-${targetMarket.stores.length + 1}`;
      // } else {
      //   storeId = `${store.marketId}-1`;
      // }
      await db.collection("Stores")
        .doc(store.storeId)
        .set({
          name: store.name,
          deliveryTimings: store.deliveryTimings,
          operatingTimes: store.operatingTimes,
          pocName: store.pocName,
          pocContact: store.pocContact,
          image: null,
          enabled: true
        })
      await dispatch('uploadStorePic', { image: store.image, storeId: store.storeId })
      return dispatch("addStoreToMarket", { 
        marketId: store.marketId,
        storeId: store.storeId
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
    toggleStoreStatus(context, { id, newStatus }) {
      return db.collection("Stores")
        .doc(id)
        .update({
          enabled: newStatus
        })
    },
    async addMenuItemToStore({ dispatch }, menuItem) {
      var menuItemRef = await dispatch("addMenuItem", {
        name: menuItem.name,
        price: menuItem.price,
        deliverySlots: menuItem.deliverySlots,
        image: null
      })
      if (menuItem.image) {
        await dispatch("uploadItemPic", { ref: menuItemRef, image: menuItem.image })
      }
      return db.collection("Stores")
        .doc(menuItem.storeId)
        .update({ // update the list of items the store carries
          menu: firebase.firestore.FieldValue.arrayUnion(menuItemRef.id)
        })
    },
    removeMenuItemFromStore(context, { storeId, itemId }) {
      return db.collection("Stores")
        .doc(storeId)
        .update({
          menu: firebase.firestore.FieldValue.arrayRemove(itemId)
        })
    }
  },
  getters: {
    getStores: state => {
      return state.stores;
    }
  },
};