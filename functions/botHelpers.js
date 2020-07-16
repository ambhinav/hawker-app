const admin = require("firebase-admin");
const dateTimeHelpers = require("./utils/dateTime");
const DOUBLE_SPACED = "\n\n";
const StatesEnum = {
  PAID: 0,
  CANCELLED: 1,
  GO_BACK: 3,
  ORDER_COMPLETED: 4
};

const createAdminMessage = async orderData => {
  const { 
    created_at,
    customerName,
    customerNumber,
    deliveryAddress,
    deliveryCost,
    totalCost,
    orderNumber,
    paymentMethod,
    cart,
    cartStoreMappings,
    deliverySlot
  } = orderData;
  var storeOrders = await processCart(cart, cartStoreMappings);
  var cartDetails = storeOrders.reduce((acc, storeOrder) => {
    return acc += storeOrder + "\n";
  }, "Order Details: \n\n")
  var formattedDate = dateTimeHelpers.formatCreateDate(created_at);
  var message = `Order Number: ${orderNumber}(${formattedDate})` + DOUBLE_SPACED
    + cartDetails + DOUBLE_SPACED
    + `Delivery Cost: ${deliveryCost}` + DOUBLE_SPACED
    + `Total Cost: ${totalCost}` + DOUBLE_SPACED
    + `Payment Method: ${paymentMethod}` + DOUBLE_SPACED
    + "Delivery Details:" + DOUBLE_SPACED
    + `Delivery Slot: ${deliverySlot}` + DOUBLE_SPACED
    + `Customer Name: ${customerName}` + DOUBLE_SPACED
    + `Contact: ${customerNumber}` + DOUBLE_SPACED
    + `Address: ${deliveryAddress}`;
  return message;
}

// Creates a list containing the orders for each store in the target market
const processCart = async (cart, cartStoreMappings) => {
  var result = await Promise.all(Object.entries(cartStoreMappings).map(async mapping => {
    var storeId = mapping[0];
    var storeData = await admin.firestore().collection("Stores").doc(storeId).get().then(ref => ref.data());
    var { name, stallNumber } = storeData;
    var items = mapping[1];
    var storeOrder = `${name}` + "\n"
      + `${stallNumber}` + "\n";
    items.forEach((itemId, index) => {
      var matchingItem = cart.find(cartItem => cartItem.id == itemId);
      storeOrder += `${index + 1}) ${matchingItem.name} x ${matchingItem.qty}` + "\n";
      if (matchingItem.specialInstructions) {
        storeOrder += `(Special instruction: ${matchingItem.specialInstructions})` + "\n"
      }
    })
    return storeOrder;
  }))
  return result
}

const updateOrderStatus = (newStatus, orderId) => {
  return admin.firestore().collection("Orders")
  .doc(orderId)
  .update({
    orderStatus: newStatus
  })
}

module.exports = {
  createAdminMessage,
  StatesEnum,
  updateOrderStatus
}