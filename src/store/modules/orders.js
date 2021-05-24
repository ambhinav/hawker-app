import firebase from 'firebase';
import { getTimeStamp, getMilkRunScheduleTime } from '@/utils/dateTimeUtil';
import { db } from '@/firebase/init';
import { v4 as uuidv4 } from "uuid";
import { deliveryTimingsMapping } from '../../utils/deliveryData';
import { getAPIKey } from '../../../secrets/milkrun';
import { deleteData, postData } from '../../utils/api';
var statsRef = db.collection("Orders").doc("--stats--");
const MILK_RUN_API = location.hostname === "localhost" 
  ? "https://cors-anywhere.herokuapp.com/" + "https://milkrun.tk/api/integration/merchants" 
  : "https://milkrun.ml/api/integration/merchants";
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
        state.orders.unshift(payload.order);
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
        deliveryLat: deliveryLocation["LATITUDE"],
        deliveryLong: deliveryLocation["LONGITUDE"],
        deliveryUnitNumber: unitNumber,
        distance: deliveryDistance,
        cart: getters.getCart,
        created_at: getTimeStamp(),
        orderStatus: "pending", // three main statuses: PENDING, CANCELLED, PAID
        cartStoreMappings: getters.getCartStoreMappings,
        deliverySlot: deliveryTime, // A, B, C, ... etc,
        isMilkRunJob: false
      };
      var orderNumber = await db.runTransaction(trx => {
        return trx.get(statsRef).then(statsDoc => {
          var orderToAddRef = db.collection("Orders").doc(uuidv4());
          let formattedNum = "";
          if (!statsDoc.exists) { // first ever order
            var count = 1;
            formattedNum = `${marketId}#${leftFillNum(count, 3)}`;
            trx.set(statsRef, { [marketId]: count });
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
    },
    removeItemFromOrder(context, { order, item }) {
      var itemToRemoveCost = item.qty * item.price;
      var newTotalCost = order.totalCost - itemToRemoveCost;
      return db.collection("Orders")
        .doc(order.id)
        .update({
          cart: firebase.firestore.FieldValue.arrayRemove(item),
          totalCost: newTotalCost
        })
    },
    async updateItemQtyInOrder(context, { order, item, oldQty }) {
      var updatedItemCost = (item.qty - oldQty) * item.price;
      var newTotalCost = order.totalCost + updatedItemCost;
      let oldOrder = await db.collection("Orders")
        .doc(order.id)
        .get()
        .then(doc => {
          if (doc.exists) {
            return doc.data();
          } else {
            throw new Error("Doc does not exist");
          }
        });
      let newCart = oldOrder.cart.filter(currItem => currItem.id != item.id);
      newCart.push(item);
      const newOrder = {
        ...oldOrder,
        totalCost: newTotalCost,
        cart: newCart
      }
      await context.commit("replaceOrder", {
        order: newOrder
      })
      return db.collection("Orders")
        .doc(order.id)
        .set(newOrder);
    },
    async createMilkRunDeliveryJob({ getters }, { order, isScheduled }) {
      const {
        id,
        deliveryAddress,
        deliveryLat,
        deliveryLong,
        deliveryUnitNumber,
        marketId,
        customerNumber,
        cartStoreMappings,
        deliverySlot,
      } = order;
      const order_destinations = [
        {
          customer_phone_number: `+65${customerNumber}`,
          delivery_address: deliveryAddress,
          delivery_lat: deliveryLat,
          delivery_lng: deliveryLong,
          delivery_address_details: deliveryUnitNumber
        }
      ];
      const pick_up_address_details = Object.keys(cartStoreMappings)
        .map(storeId => storeId.replace(marketId, "#"))
        .join();
      const marketData = getters.getMarkets.find(market => market.id == marketId);
      const milkRunOrder = {
        uuid: order.id,
        pick_up_address: marketData.address,
        pick_up_lat: marketData.location.latitude,
        pick_up_lng: marketData.location.longitude,
        pick_up_address_details,
        order_destinations
      };
      try {
        // create order
        await postData(`${MILK_RUN_API}/orders`, milkRunOrder, getAPIKey());
        // submit order
        if (isScheduled) {
          const scheduled_time = getMilkRunScheduleTime(deliveryTimingsMapping[deliverySlot]);
          var res = await postData(`${MILK_RUN_API}/orders/${order.id}/submit`, { scheduled_time }, getAPIKey());
          if (Object.prototype.hasOwnProperty.call(res, "error")) {
            throw new Error(`Error code ${res.code}: ${res.error}`);
          }
        } else {
          await postData(`${MILK_RUN_API}/orders/${order.id}/submit`, {}, getAPIKey());
        }
        return db.collection("Orders")
          .doc(id)
          .update({
            isMilkRunJob: true
          });
      } catch (error) {
        await db.collection("Orders")
          .doc(id)
          .update({
            isMilkRunJob: false
          });
        throw new Error("Could not create Milk Run Job!");
      }
    },
    cancelMilkRunDeliveryJob(context, { deliveryId }) {
      try {
        return deleteData(`${MILK_RUN_API}/orders/${deliveryId}`, getAPIKey());
      } catch (error) {
        throw new Error("Could not delete Milk Run Job!");
      }
    }
  }
};