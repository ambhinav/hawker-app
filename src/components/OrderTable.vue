<template>
  <v-container>
    <v-row justify="center">
      <v-data-table
      :headers="headers"
      :items="getNewCart()"
      class="elevation-1"
      hide-default-footer
      show-expand
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Your order for {{ getMarketName }}</v-toolbar-title>
          </v-toolbar>
        </template>
        <template v-slot:item.img="{ item }">
          <v-avatar
          size="40px"
          rounded
          v-if="item.image"
          >
            <img
              v-if="item.image"
              :src="item.image"
            >
          </v-avatar>
        </template> 
        <template v-slot:item.cost="{ item }">
          {{ item.name == "Delivery Cost" || item.name == "Total Cost" ? item.price : getCost(item) }}
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length" v-if="item.specialInstructions">Instruction: {{ item.specialInstructions }}</td>
        </template>
      </v-data-table>
    </v-row>
    <v-row justify="center">
      <v-col cols="7">
      </v-col>
      <v-col cols="3"> 
        <v-btn color="primary" @click="editCart">
          Edit Cart
        </v-btn>
      </v-col>
      <v-col cols="2">
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
          text: 'Image',
          align: 'start',
          sortable: false,
          value: 'img',
        },
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
    editCart() {
      this.$router.push("/store");
    },
    getNewCart() {
      var copy = JSON.parse(JSON.stringify(this.getCart));
      copy.push({ name: "Delivery Cost", price: 9 }, { name: "Total Cost", price: this.getTotalPrice + 9 })
      return copy
    }
  }
}
</script>

<style>

</style>