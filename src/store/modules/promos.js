import { db } from '@/firebase/init';

/*
  promo object structure:
  
  {
    qty: 500,
    code: 5OFF,
    enabled: false,
  }

*/

export default {
  state: {
    promos: []
  },
  getters: {
    getPromos: (state) => state.promos
  },
  mutations: {
    setPromos(state, payload) {
      if (!state.promos.find(promo => promo.id == payload.promo.id)) {
        state.promos.push(payload.promo);
      }
    },
    replacePromo(state, payload) {
      state.promos = state.promos.filter(promo => {
        return promo.id != payload.promo.id;
      });
      if (!state.promos.find(promo => promo.id == payload.promo.id)) {
        state.promos.push(payload.promo);
      }
    },
    removePromo: (state, payload) => {
        state.promos = state.promos.filter(promo => {
            return promo.id != payload.promo.id;
        });
    },
  },
  actions: {
    /** Initialised when admin logs in @see Promos.vue and when customer enters @see OrderDetails.vue */
    initPromos(context) {
      db.collection("Promotions")
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            var doc = change.doc;
            var promoData = doc.data();
            promoData.id = doc.id;
            if (change.type == "added") {
              context.commit("setPromos", {
                promo: promoData
              });
            }
            if (change.type == "modified") {
              context.commit("replacePromo", {
                promo: promoData
              });
            }
            if (change.type == "removed") {
              context.commit("removePromo", {
                promo: promoData
              });
            }
          }
        );
      })
    },
    createPromo(context, promo) {
      return db.collection("Promotions")
        .add({
          ...promo,
          enabled: false
        })
    },
    updatePromo(context, { promoId, data }) {
      return db.collection("Promotions")
        .doc(promoId)
        .update({
          ...data
        })
    },
    deletePromo(context, { promoId }) {
      return db.collection("Promotions")
        .doc(promoId)
        .delete();
    },
    /** 
     * Dispatched when an order is created to ensure that promotions are used up accurately 
     * After calculation, If promo code is found to be fully redeemed, its disabled
    */
    onPromoCodeRedeemed(context, promoId) {
      var promoRef = db.collection("Promotions").doc(promoId);
      return db.runTransaction(trx => {
        return trx.get(promoRef).then(promoDoc => {
          var qty = promoDoc.data().qty;
          var newQty = qty - 1;
          if (newQty == 0) { // last promo code is used
              trx.update(promoRef, {
                enabled: false
              })
          }
          return trx.update(promoRef, {
              qty: newQty
            });
        });
      })
    }
  }
};