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
  },
  getters: {
  },
  mutations: {
  },
  actions: {
    /**
     * Processes a new order that is paid via Paynow or Cash on delivery.
     * Runs a transaction to ensure that order number integrity is kept.
     * Updates store with customer details and order number.
     * @param {*} customerDetails details given in @see CustomerDetails.vue
     */
    async addPaynowAndCashOrder({ commit, getters }, customerDetails) {
      var { paymentMethod, customerName, phoneNumber } = customerDetails;
      var { deliveryLocation, marketId, deliveryCost } = getters.getDeliveryDetails;
      var orderDetails = {
        marketId,
        paymentMethod,
        customerName,
        customerNumber: phoneNumber,
        deliveryCost,
        deliveryAddress: deliveryLocation["ADDRESS"],
        cart: getters.getCart,
        created_at: getTimeStamp(),
        orderStatus: "pending" // three main statuses: pending, cancelled, paid
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
      return commit("setCustomerDetails", { ...customerDetails, orderNumber }); 
    }
  }
};