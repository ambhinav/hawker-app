<template>
  <v-container>
    <v-row justify="center" class="pt-5">
      <v-card shaped>
        <v-card-title>
          <div>
            <h2>Thank you! Your order has been received</h2>
            <br>
            <h4>Order ID: {{ getOrderId }}</h4>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-row>
              Name: {{ getDeliveryDetails.customerName }}
            </v-row>
            <v-row>
              Phone Number: {{ getDeliveryDetails.phoneNumber }}
            </v-row>
            <v-row>
              Address: {{ getDeliveryDetails.deliveryLocation["ADDRESS"] }}, {{ getDeliveryDetails.unitNumber }}
            </v-row>
            <v-row>
            </v-row>
            <v-row>
              Payment mode: {{ getDeliveryDetails.paymentMethod }}
            </v-row>
            <v-row justify="center">
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">Name</th>
                      <th class="text-left">Quantity</th>
                      <th class="text-left">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in getNewCart" :key="item.name">
                      <td>{{ item.name }}</td>
                      <td>{{ item.name == "Delivery Cost" || item.name == "Total Cost" ? "" : item.qty }}</td>
                      <td>{{ item.name == "Delivery Cost" || item.name == "Total Cost" ? item.price : getPrice(item) }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-row>
            <v-row>
              <v-col cols="12" class="primary--text">
                *Please contact the administrator for order status
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="1">
                <v-icon>mdi-whatsapp</v-icon>
              </v-col>
              <v-col cols="1">
                <v-icon>mdi-telegram</v-icon>
              </v-col>
              <v-col cols="4">
                +65 91919191
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
            <v-row>
              <v-col cols="12" class="error--text">
                <div>
                  *For customers making payment via Paynow, please make payment to the number provided above.
                  <br>
                  *Please take a screenshot of the invoice for reference.
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: "Invoice",
  beforeRouteLeave(to, from, next) {
    this.resetCartState();
    next();  
  },
  computed: {
    ...mapGetters(["getDeliveryDetails", "getCart", "getTotalPrice"]),
    getDeliveryCost() {
      if(!Object.prototype.hasOwnProperty.call(this.getDeliveryDetails, "deliveryCost")) {
        return 6;
      } else {
        return this.getDeliveryDetails.deliveryCost; 
      }
    },
    getTotalCost() {
      return parseFloat(this.getTotalPrice) + this.getDeliveryCost;
    },
    getNewCart() {
      var copy = JSON.parse(JSON.stringify(this.getCart));
      copy.push({ name: "Delivery Cost", price: this.getDeliveryCost }, { name: "Total Cost", price: this.getTotalCost })
      return copy
    },
    getOrderId() {
      return this.getDeliveryDetails.orderNumber;
    }
  },
  methods: {
    ...mapMutations(["resetCartState"]),
    getPrice(item) {
      return parseFloat(parseFloat(item.price) * parseInt(item.qty)).toFixed(1);
    },
  }
}
</script>

<style>

</style>