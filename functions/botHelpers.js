/* eslint-disable prettier/prettier */
const admin = require("firebase-admin");
const dateTimeHelpers = require("./utils/dateTime");
const { HAWKER_GROUPS, LOGISTICS_CONTACT } = require("./secrets/telegram")
const { HAWKER_ADDRESS, PICKUP_TIMINGS } = require("./utils/messageHelpers");
const DOUBLE_SPACED = "\n\n";
const SINGLE_SPACED = "\n";
const StatesEnum = {
  PAID: 0,
  CANCELLED: 1,
  GO_BACK: 3,
  ORDER_COMPLETED: 4
};

// creates and sends each store's orders to the relevant hawker telegram group
const sendHawkerGroupMessage = async (orderData, bot) => {
  const {
    created_at,
    orderNumber,
    deliverySlot,
    marketId,
    hawkerGroupMessageData
  } = orderData;
  var formattedDate = dateTimeHelpers.formatCreateDate(created_at);
  var header = `Order Number: ${orderNumber}(${formattedDate})` + SINGLE_SPACED
    + `Delivery slot: ${dateTimeHelpers.convertToTwelveHourFormat(deliverySlot)}` + SINGLE_SPACED
    + `Pick up timing: ${PICKUP_TIMINGS[deliverySlot]}`; // 12 hr format
  return Promise.all(hawkerGroupMessageData.map(storeOrder => {
    var message = `${header}${DOUBLE_SPACED}${storeOrder}`;
    return bot.telegram.sendMessage(HAWKER_GROUPS[marketId], message);
  }))
}

const sendLogisticsGroupMessage = async (message, bot) => {
  return bot.telegram.sendMessage(LOGISTICS_CONTACT, message);
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
    deliverySlot, // 24 HR format
    marketId,
  } = orderData;
  var cartDetails = storeOrders.reduce((acc, storeOrder) => {
    return acc += storeOrder + "\n";
  }, "--ORDER DETAILS-- \n\n")
  var formattedDate = dateTimeHelpers.formatCreateDate(created_at);
  var message = `Order Number: ${orderNumber}(${formattedDate})` + DOUBLE_SPACED
    + cartDetails + DOUBLE_SPACED
    + `Total Cost: ${totalCost}` + DOUBLE_SPACED
    + "--PICKUP DETAILS--" + DOUBLE_SPACED
    + `Pick up location: ${HAWKER_ADDRESS[marketId]}` + DOUBLE_SPACED
    + `Pick up at: ${PICKUP_TIMINGS[deliverySlot]}` + DOUBLE_SPACED // 12 hr format
    + "--DELIVERY DETAILS--" + DOUBLE_SPACED
    + `Payment Method: ${paymentMethod}` + DOUBLE_SPACED
    + `Delivery Slot: ${dateTimeHelpers.convertToTwelveHourFormat(deliverySlot)}` + DOUBLE_SPACED // converted to 12 hr format
    + `Customer Name: ${customerName}` + DOUBLE_SPACED
    + `Customer Contact: ${customerNumber}` + DOUBLE_SPACED
    + `Customer Address: ${deliveryAddress}` + SINGLE_SPACED
    + `Unit No.: ${deliveryUnitNumber}`;
    + `Delivery Cost: ${deliveryCost}` + DOUBLE_SPACED
  return message;
}

// Creates a list containing the orders for each store in the target market
const processCart = async (cart, cartStoreMappings) => {
  var sales = {};
  var result = await Promise.all(Object.entries(cartStoreMappings).map(async mapping => {
    var storeId = mapping[0];
    sales[storeId] = [] // to store info about items and qty
    var storeData = await admin.firestore().collection("Stores").doc(storeId).get().then(ref => ref.data());
    var { name, stallNumber } = storeData;
    var items = mapping[1];
    var storeOrder = `${name}` + "\n"
      + `${stallNumber}` + "\n";
    items.forEach((itemId, index) => {
      var matchingItem = cart.find(cartItem => cartItem.id == itemId);
      var currItems = sales[storeId]
      currItems.push(matchingItem.qty * matchingItem.nm);
      sales[storeId] = currItems;
      storeOrder += `${index + 1}) ${matchingItem.name} x ${matchingItem.qty}` + "\n";
      if (matchingItem.specialInstructions) {
        storeOrder += `(Special instruction: ${matchingItem.specialInstructions})` + "\n"
      }
    });
    return storeOrder;
  }));

  return [result, sales];
}

/**
 * 
 * Updates the order to include important mappings and messages
 * @param {*} orderId 
 * @param {*} cartStoreMappings used to calculate daily expenses
 * @param {*} hawkerGroupMessageData used to send the hawker group message
 * @param {*} adminMessage used to send the logistics partner message
 */
const updateOrderOnCreated = (orderId, cartStoreMappings, hawkerGroupMessageData, adminMessage) => {
  return admin.firestore()
    .collection("Orders")
    .doc(orderId)
    .update({
      cartStoreMappings,
      hawkerGroupMessageData,
      adminMessage
    });
};

const updateOrderStatus = async (newStatus, orderId) => {
  return admin.firestore().collection("Orders")
  .doc(orderId)
  .update({
    orderStatus: newStatus
  })
}

// get the orders that were made today and are paid
// enumerate an array with all the cart store mappings of those orders
const getDailyExpense = async () => {
  let m1 = dateTimeHelpers.getToday();
  let m2 = dateTimeHelpers.getToday();
  m1.startOf('day');
  m2.endOf('day');
  var data = {}
  var ordersByCost = { "6": 0, "12": 0 };
  var completedOrders = await admin.firestore()
    .collection("Orders")
    .orderBy('created_at', "desc")
    .where("orderStatus", "==", "paid")
    .where("created_at", ">", m1.valueOf())
    .where("created_at", "<=", m2.valueOf())
    .get()

  completedOrders.docs.forEach(order => {
    var deliveryCost = order.data().deliveryCost.toString();
    var currentVal = ordersByCost[deliveryCost];
    currentVal++;
    ordersByCost[deliveryCost] = currentVal;
  })

  var mappings = completedOrders.docs.map(order => order.data().cartStoreMappings)
  mappings.forEach(mapping => {
    Object.entries(mapping).forEach(val => {
      const storeId = val[0];
      if (!Object.prototype.hasOwnProperty.call(data, storeId)) {
        data[storeId] = [];
      }
      const itemData = val[1];
      var totalCostForStoreFromThatOrder = itemData.reduce((acc, cost) => acc + cost, 0);
      // update the store data
      currItems = data[storeId];
      currItems.push(totalCostForStoreFromThatOrder);
      data[storeId] = currItems;
    })
  })
  result = {};
  Object.entries(data).forEach(val => {
    storeId = val[0];
    costs = val[1];
    result[storeId] = costs.reduce((acc, val) => acc + val, 0);
  })
  return admin.firestore()
    .collection("Expenses")
    .add({
      created_at: dateTimeHelpers.getToday().valueOf(),
      expenses: result,
      numberOfOrdersCompleted: completedOrders.docs.length,
      deliveryPricings: ordersByCost
    })
}

module.exports = {
  createAdminMessage,
  processCart,
  sendHawkerGroupMessage,
  StatesEnum,
  updateOrderStatus,
  getDailyExpense,
  sendLogisticsGroupMessage,
  updateOrderOnCreated
}