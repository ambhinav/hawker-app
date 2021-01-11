import { db, storage } from "@/firebase/init";
import { firestore }  from 'firebase';

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
          stores: firestore.FieldValue.arrayUnion(storeId)
        })
    },
    async createMarket({ dispatch }, payload) {
      // fetch market location in lat, lang
      var fullMarketLocation = await fetch(
          `https://developers.onemap.sg/commonapi/search?searchVal=${payload.postalCode}&returnGeom=Y&getAddrDetails=N&pageNum=1`,
          {
            credentials: 'omit'
          }
        )
        .then(res => res.json())
        .then(res => {
          if (!res.results) {
            return [];
          }
          return res.results[0]; // get first result only
        });
      var location = new firestore.GeoPoint(
        parseFloat(fullMarketLocation["LATITUDE"]),
        parseFloat(fullMarketLocation["LONGITUDE"])
      );
      console.log(location);
      var createMarketPromise = db.collection("Markets")
        .doc(payload.id)
        .set({
          name: payload.name,
          address: payload.address,
          location,
          imageUrl: null,
          imageUrlLarge: null,
          enabled: true,
        })
      return Promise.all([
        createMarketPromise,
        dispatch('uploadMarketPic', { image: payload.image, marketId: payload.id })
      ]);
    },
    async uploadMarketPic(context, { image, marketId }) {
      var storageRef = storage.ref()
      var marketPic = storageRef.child("/marketPics/"+marketId+".jpg")
      var marketPicThumb = storageRef.child(`/marketPics/thumbs/${marketId}_400x400.jpg`);
      var snapshot = await marketPic.put(image);
      var largeImageDownloadUrl = await snapshot.ref.getDownloadURL();
      // wait for og image to be compressed server side...
      await new Promise(r => setTimeout(r, 5000));
      try {
        var thumbDownloadUrl = await marketPicThumb.getDownloadURL();
      } catch (err) {
        return new Error(); 
      }
      return db.collection('Markets')
        .doc(marketId)
        .update({
          imageUrl: thumbDownloadUrl,
          imageUrlLarge: largeImageDownloadUrl
        });
    },
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