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
const processCart = async (cart, cartStoreMappings, orderId) => {
  var sales = {}
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
    })

    return storeOrder;
  }))

  // update the order to include how many of each item was bought and from which store
  await admin.firestore()
    .collection("Orders")
    .doc(orderId)
    .update({
      cartStoreMappings: sales
    })

  return result
}

const updateOrderStatus = (newStatus, orderId) => {
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
  var ordersByCost = { "6": 0, "9": 0 };
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
  getDailyExpense
}