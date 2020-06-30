import { getDistanceFromLatLonInKm } from '@/utils/distanceCalculator';

const getDefaultState = () => {
  return {
    cart: [],
    deliveryDetails: {}
  }
}

export default {
  state: {
    deliveryDetails: {},
    cart: [],
  },
  getters: {
    getDeliveryDetails: (state) => state.deliveryDetails,
    getCart: (state) => state.cart,
    isCartFilled: (state) => state.cart.length > 0,
    getTotalPrice: (state) => {
      return state.cart.reduce((acc, currItem) => { 
        return acc + (parseFloat(currItem.price) * parseInt(currItem.qty))
      }, 0)
    },
    getCartLength: (state) => state.cart.length,
  },
  mutations: {
    addItemToCart(state, item) {
      state.cart.push({
        ...item,
      })
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
      state.cart = state.cart.filter(item => item.id !== targetItem.id)
    },
    setDeliveryDetails: (state, deliveryDetails) => state.deliveryDetails = { ...deliveryDetails },
    setCustomerDetails: (state, customerDetails) => state.deliveryDetails = { ...state.deliveryDetails, ...customerDetails },
    setDeliveryLocation: (state, deliveryLocation) => state.deliveryDetails = { ...state.deliveryDetails, deliveryLocation },
    setDeliveryCost: (state, deliveryCost) => state.deliveryDetails = { ...state.deliveryDetails, deliveryCost },
    resetCartState: (state) => Object.assign(state, getDefaultState())
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