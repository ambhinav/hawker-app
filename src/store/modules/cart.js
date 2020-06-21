export default {
  state: {
    deliveryDetails: {}
  },
  getters: {
    getDeliveryDetails: (state) => state.deliveryDetails
  },
  mutations: {
    setDeliveryDetails: (state, deliveryDetails) => state.deliveryDetails = { ...deliveryDetails },
    resetDeliveryDetails: (state) => state.deliveryDetails = {}
  },
  actions: {
   
  },
};