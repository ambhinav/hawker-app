<template>
  <v-container>
    <v-row justify="center">
      <h2>
        Your order from {{ getMarketName }} food center:
      </h2>
    </v-row>
    <v-row justify="center">
      <v-data-table
      :headers="headers"
      :items="getCart"
      class="elevation-1"
      hide-default-footer
      :mobile-breakpoint="300"
      >
        <template v-slot:item.cost="{ item }">
          {{ getCost(item) }}
        </template>
      </v-data-table>
    </v-row>
    <v-row v-if="getPostalCode" justify="space-between">
      <v-col cols="12">
        <div class="teal--text text-end pl-md-4">
          Delivery cost: $8
        </div>
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col cols="6">
        <v-btn color="primary">
          Edit
        </v-btn>
      </v-col>
      <v-col cols="6">
        <div class="teal--text text-end">
          Total price: ${{ getTotalPrice }}
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: "OrderTable",
  data () {
    return {
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        {
          text: 'Quantity',
          align: 'start',
          sortable: false,
          value: 'qty',
        },
        {
          text: 'Cost (S$)',
          align: 'start',
          sortable: false,
          value: 'cost',
        },
      ]
    }
  },
  computed: {
    ...mapGetters(["getCart", "getMarkets", "getDeliveryDetails", "getTotalPrice"]),
    getMarketName() {
      var targetMarket = this.getMarkets.find(market => market.id === this.getDeliveryDetails.marketId); 
      return targetMarket.name;
    },
    getPostalCode() {
      if(!Object.prototype.hasOwnProperty.call(this.getDeliveryDetails, "postalCode")) {
        return null;
      }
      return this.getDeliveryDetails.postalCode; 
    },
    getTotalCost() {
      return parseInt(this.geTotlaPrice) + 8;
    }
  },
  methods: {
    getCost(item) {
      return parseFloat(item.price) * parseInt(item.qty);
    },
  }
}
</script>

<style>

</style>