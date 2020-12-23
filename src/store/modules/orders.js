import { getTimeStamp } from '@/utils/dateTimeUtil';
import { db } from '@/firebase/init';
var statsRef = db.collection("Orders").doc("--stats--");
import { v4 as uuidv4 } from "uuid";

// used to pad the order numbers with leading 0s
const leftFillNum = (num, targetLength) => {
  return num.toString().padStart(targetLength, 0);
};

export default {
  state: {
    orders: []
  },
  getters: {
    getOrders: (state) => state.orders
  },
  mutations: {
    setOrders(state, payload) {
      if (!state.orders.find(order => order.id == payload.order.id)) {
        state.orders.push(payload.order);
      }
    },
    replaceOrder(state, payload) {
      state.orders = state.orders.filter(order => {
        return order.id != payload.order.id;
      });
      if (!state.orders.find(order => order.id == payload.order.id)) {
        state.orders.push(payload.order);
      }
    },
  },
  actions: {
    /** Initialised when admin logs in {@see Orders.vue} */
    initOrders(context) {
      db.collection("Orders")
        .orderBy("created_at", "desc")
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            var doc = change.doc;
            if (doc.id !== "--stats--") {
              var orderData = doc.data();
              orderData.id = doc.id;
              if (change.type == "added") {
                context.commit("setOrders", {
                  order: orderData
                });
              }
              if (change.type == "modified") {
                context.commit("replaceOrder", {
                  order: orderData
                });
              }
            }
          });
        });
    },
    /**
     * Processes a new order that is paid via Paynow or Cash on delivery.
     * Runs a transaction to ensure that order number integrity is kept.
     * Updates the promo codes used
     * Updates store with customer details and order number.
     * @param {*} customerDetails details given in @see CustomerDetails.vue
     */
    async addPaynowAndCashOrder({ commit, getters, dispatch }, customerDetails) {
      var { paymentMethod, customerName, phoneNumber, unitNumber } = customerDetails;
      var { deliveryLocation, marketId, deliveryCost, deliveryTime, deliveryDistance } = getters.getDeliveryDetails;
      var orderDetails = {
        marketId,
        paymentMethod,
        customerName,
        customerNumber: phoneNumber,
        deliveryCost,
        totalCost: getters.getTotalCost,
        deliveryAddress: deliveryLocation["ADDRESS"],
        deliveryUnitNumber: unitNumber,
        distance: deliveryDistance,
        cart: getters.getCart,
        created_at: getTimeStamp(),
        orderStatus: "pending", // three main statuses: pending, cancelled, paid
        cartStoreMappings: getters.getCartStoreMappings,
        deliverySlot: deliveryTime
      }; 
      var orderNumber = await db.runTransaction(trx => {
        return trx.get(statsRef).then(statsDoc => {
          var orderToAddRef = db.collection("Orders").doc(uuidv4());
          let formattedNum = "";
          if (!statsDoc.exists) { // first ever order
            var count = 1;
            formattedNum = `${marketId}#${leftFillNum(count, 3)}`;
            trx.set(statsRef, { [marketId]: count  });
            trx.set(orderToAddRef, { ...orderDetails, orderNumber: formattedNum });
            return formattedNum;
          }
          let newCount = 0;
          // subsequent orders
          // TODO: reset the count in --stats-- if it passes 999
          if (!statsDoc.data()[marketId]) { // first order for this market
            newCount = 1;
          } else { 
            newCount = statsDoc.data()[marketId] + 1;
          }
          formattedNum = `${marketId}#${leftFillNum(newCount, 3)}`;
          trx.update(statsRef, { [marketId]: newCount });
          trx.set(orderToAddRef, { ...orderDetails, orderNumber: formattedNum });
          return formattedNum;
        })
      })
      if (Object.keys(getters.getRedeemedPromo).length > 0) { // redeem promo code if used
        await dispatch("onPromoCodeRedeemed", getters.getRedeemedPromo.id)
      }
      return commit("setCustomerDetails", { ...customerDetails, orderNumber }); 
    },
    toggleOrderStatus(context, { newStatus, orderId }) {
      return db.collection("Orders")
        .doc(orderId)
        .update({
          orderStatus: newStatus
        });
    }
  }
};