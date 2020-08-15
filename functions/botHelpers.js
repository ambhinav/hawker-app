const admin = require("firebase-admin");
const dateTimeHelpers = require("./utils/dateTime");
const { HAWKER_GROUPS } = require("./secrets/telegram")
const DOUBLE_SPACED = "\n\n";
const SINGLE_SPACED = "\n";
const StatesEnum = {
  PAID: 0,
  CANCELLED: 1,
  GO_BACK: 3,
  ORDER_COMPLETED: 4
};

// creates and sends each store's orders to the relevant hawker telegram group
const sendHawkerGroupMessage = async (orderData, storeOrders, bot) => {
  const {
    created_at,
    orderNumber,
    deliverySlot,
    marketId
  } = orderData;
  var formattedDate = dateTimeHelpers.formatCreateDate(created_at);
  var header = `Order Number: ${orderNumber}(${formattedDate})` + SINGLE_SPACED
    + `Delivery slot: ${deliverySlot}`;
  return Promise.all(storeOrders.map(storeOrder => {
    var message = `${header}${DOUBLE_SPACED}${storeOrder}`;
    return bot.telegram.sendMessage(HAWKER_GROUPS[marketId], message);
  }))
}

const createAdminMessage = async (orderData, storeOrders) => {
  const { 
    created_at,
    customerName,
    customerNumber,
    deliveryAddress,
    deliveryUnitNumber,
    deliveryCost,
    totalCost,
    orderNumber,
    paymentMethod,
    deliverySlot
  } = orderData;
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
    + `Address: ${deliveryAddress}` + SINGLE_SPACED
    + `Unit No.: ${deliveryUnitNumber}`;
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
  processCart,
  sendHawkerGroupMessage,
  StatesEnum,
  updateOrderStatus
}