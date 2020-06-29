<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2>Thank you! Your order has been received"</h2>
        <br>
        <h3>Please take a screen shot of the invoice below for reference</h3>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row>
      <v-card shaped>
        <v-card-title>Order ID: {{ getDeliveryDetails.invoiceNumber }}</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              Name: {{ getDeliveryDetails.customerName }}
            </v-row>
            <v-row>
              Phone Number: {{ getDeliveryDetails.customerPhoneNumber }}
            </v-row>
            <v-row>
              Address: {{ getDeliveryDetails.deliveryLocation["ADDRESS"] }}
            </v-row>
            <v-row>
              Payment mode: {{ getDeliveryDetails.paymentMode }}
            </v-row>
            <v-row>
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
                Please contact the administrator for order status
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-icon>mdi-whatsapp</v-icon>
                <v-icon>mdi-telegram</v-icon>
              </v-col>
              <v-col cols="8">
                +65 91919191
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="error--text">
                Note: For customers making payment via Paynow, please send proof of your e-payment to the administrator either through Whatsapp or Telegram.
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: "Invoice",
  computed: {
    ...mapGetters(["getDeliveryDetails", "getCart"]),
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
  },
  methods: {
    getPrice(item) {
      return parseFloat(item.price) * parseInt(item.qty);
    },
  }
}
</script>

<style>

</style>