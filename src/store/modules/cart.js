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
    clearCart(state) {
      state.cart = []
    },
    setDeliveryDetails: (state, deliveryDetails) => state.deliveryDetails = { ...deliveryDetails },
    clearDeliveryDetails: (state) => state.deliveryDetails = {},
    addDeliveryDetails: (state, customerDetails) => state.deliveryDetails = { ...state.deliveryDetails, ...customerDetails }
  },
  actions: {
   
  },
};