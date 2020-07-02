const admin = require("firebase-admin");
admin.initializeApp();

// formats the order cart to telegram msg
const processCart = async (cart, marketId) => {
  var organisedCart = await organiseCart(cart, marketId);
  var result = "Order Details: " + "\n\n";
  Object.entries(organisedCart).forEach(itemArray => {
    var storeName = itemArray[0];
    var details = itemArray[1];
    var storeOrder = `${storeName}` + "\n"
      + `${details.stallNumber}` + "\n";
    details.matchingItems.forEach((item, index) => {
      storeOrder += `${index + 1}) ${item.name} x ${item.qty}` + "\n";
      if (item.specialInstructions) {
        storeOrder += `(Special instruction: ${item.specialInstructions})` + "\n"
      }
    })
    return result += storeOrder + "\n\n";
  })
  return result;
}

/** Result looks like { "Adam Road": { stallNumber: "#01-26", matchingItems: [item1, item2...] }, ... } */
const organiseCart = async (cart , marketId) => {
  var targetMarket = await admin.firestore()
    .collection("Markets")
    .doc(marketId)
    .get()
    .then(ref => ref.data());
  var marketStores = targetMarket.stores; // list of store IDs attached to market 
  return marketStores.reduce(async (acc, storeId) => {
    var accumulator = await acc.then(); // since the callback returns a promise
    var targetStore = await admin.firestore().collection("Stores").doc(storeId).get().then(ref => ref.data());
    const { menu, name, stallNumber } = targetStore;
    var matchingItems = cart.filter(cartItem => menu.includes(cartItem.id));
    accumulator[name] = { matchingItems, stallNumber };
    return Promise.resolve(accumulator);
  }, Promise.resolve({}));
}

module.exports = {
  processCart
}