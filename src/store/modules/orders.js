import firebase from 'firebase';
import { getTimeStamp } from '@/utils/dateTimeUtil';
import { db } from '@/firebase/init';
import { v4 as uuidv4 } from "uuid";
import { postData } from '@/utils/api';
import { deliveryTimingsMapping } from '../../utils/deliveryData';
import { DEV_API_KEY } from '../../../secrets/milkrun';
var statsRef = db.collection("Orders").doc("--stats--");
const MILK_RUN_API = "https://milkrun.tk/api/integration/merchants";
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
        deliverySlot: deliveryTime // A, B, C, ... etc
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
      };
      const order_destinations = [
        {
          customer_phone_number: customerNumber,
          delivery_address: deliveryAddress,
          delivery_lat: deliveryLat,
          delivery_lng: deliveryLong,
          delivery_address_details: deliveryUnitNumber
        }
      ];
      const pick_up_address_details = Object.keys(cartStoreMappings).join();
      const marketData = getters.getMarkets().find(id == marketId);
      const milkRunOrder = {
        uuid: order.id,
        pick_up_address: marketData.address,
        pick_up_lat: marketData.location.lattitude,
        pick_up_long: marketData.location.longitude,
        pick_up_address_details,
        order_destinations
      };
      try {
        // create order
        await postData(`${MILK_RUN_API}/orders`, milkRunOrder, DEV_API_KEY);
        // submit order
        if (isScheduled) {
          const scheduled_time = getMilkRunScheduleTime(deliveryTimingsMapping[deliverySlot]);
          return postData(`${MILK_RUN_API}/orders/${order.id}/submit`, { scheduled_time }, DEV_API_KEY);
        } else {
          return postData(`${MILK_RUN_API}/orders/${order.id}/submit`, {}, DEV_API_KEY);
        }
      } catch (error) {
        throw new Error("Could not create Milk Run Job!");
      }
    }
  }
};