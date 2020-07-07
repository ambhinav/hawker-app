import { getDistanceFromLatLonInKm } from '@/utils/distanceCalculator';
import { isEmpty, isMinimumPurchaseAmount } from "@/utils/deliveryData";
import Vue from "vue";

// order data model
/*
  cart: {
    store1id: [
      item1id,
      item2id,
    ],
    store2id: [
      item3id,
      item4id,
    ]
  }
*/

const getDefaultState = () => {
  return {
    order: {},
    cart: [],
    deliveryDetails: {}
  }
}

export default {
  state: {
    order: {},
    deliveryDetails: {},
    cart: [],
  },
  getters: {
    getDeliveryDetails: (state) => state.deliveryDetails,
    getCart: (state) => state.cart,
    isCartFilled: (state) => {
      if (state.cart.length < 0 || isEmpty(state.order)) {
        return false;
      }
      return isMinimumPurchaseAmount(state.cart, state.order);
    },
    getTotalPrice: (state) => {
      var total = state.cart.reduce((acc, currItem) => { 
        return acc + (parseFloat(currItem.price) * parseInt(currItem.qty))
      }, 0)
      return total.toFixed(2);
    },
    getCartLength: (state) => state.cart.length,
  },
  mutations: {
    addItemToCart(state, item) {
      // update orders
      if (Object.prototype.hasOwnProperty.call(state.order, item.storeId)) {
        var currentItems = state.order[item.storeId];
        currentItems.push(item.id);
        Vue.set(state.order, item.storeId, currentItems);
      } else {
        Vue.set(state.order, item.storeId, [item.id]); // initial item for the store
      }
      // update cart
      state.cart.push({
        ...item
      });
    },
    decrementQty(state, targetItem) {
      var newQty = parseInt(targetItem.qty) - 1;
      var newItem = { ...targetItem, qty: newQty };
      var index = state.cart.findIndex(item => item.id === targetItem.id);
      state.cart.splice(index, 1, newItem);
    },
    incrementQty(state, targetItem) {
      var newQty = parseInt(targetItem.qty) + 1;
      var newItem = { ...targetItem, qty: newQty };
      var index = state.cart.findIndex(item => item.id === targetItem.id);
      state.cart.splice(index, 1, newItem);
    },
    removeItemFromCart(state, targetItem) {
      // update cart
      state.cart = state.cart.filter(item => item.id !== targetItem.id);
      // update orders
      var currentItems = state.order[targetItem.storeId];
      var filtered = currentItems.filter(itemId => itemId !== targetItem.id);
      if (filtered.length < 1) { // no more items left
        Vue.delete(state.order, targetItem.storeId);
      } else { 
        Vue.set(state.order, targetItem.storeId, filtered);
      }
    },
    resetCartState: (state) => Object.assign(state, getDefaultState()),
    setDeliveryDetails: (state, deliveryDetails) => state.deliveryDetails = { ...deliveryDetails },
    setCustomerDetails: (state, customerDetails) => state.deliveryDetails = { ...state.deliveryDetails, ...customerDetails },
    setDeliveryLocation: (state, deliveryLocation) => state.deliveryDetails = { ...state.deliveryDetails, deliveryLocation },
    setDeliveryCost: (state, deliveryCost) => state.deliveryDetails = { ...state.deliveryDetails, deliveryCost },
  },
  actions: {
    getSearchResults(context, searchTerm) {
      return fetch(
          `https://developers.onemap.sg/commonapi/search?searchVal=${searchTerm}&returnGeom=Y&getAddrDetails=Y&pageNum=1`,
          {
            credentials: 'omit'
          }
        )
        .then(res => res.json())
        .then(res => {
          if (!res.results) {
            return [];
          }
          return res.results.slice(0, 5) // get first 5 entries
        })
    },
    // finds the geolocation of users address based on OneMap's search results
    // OneMap API: https://docs.onemap.sg/#search
    // then calculates and sets delivery cost
    propogateDeliveryLocationAndCost({ state, commit, getters }, { results, targetAddress }) {
      return new Promise((resolve) => {
        var geoAddress = results.find(res => res["ADDRESS"] == targetAddress);
        commit('setDeliveryLocation', geoAddress);
        var targetMarket = getters.getMarkets.find(market => market.id === state.deliveryDetails.marketId); 
        var distance = getDistanceFromLatLonInKm(
          targetMarket.location.latitude,
          targetMarket.location.longitude,
          geoAddress["LATITUDE"],
          geoAddress["LONGITUDE"]
        )
        let cost = 6;
        if (distance > 8) {
          cost = 9;
        }
        commit("setDeliveryCost", cost);
        resolve()
      })
    },
  }
};