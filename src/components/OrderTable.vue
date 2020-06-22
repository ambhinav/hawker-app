<template>
  <v-container>
    <v-row justify="center">
      <h2>
        Your order from {{ getMarketName }} food center:
      </h2>
    </v-row>
    <v-row>
      <v-data-table
      :headers="headers"
      :items="getCart"
      class="elevation-1"
      >
        <template v-slot:item.img="{ item }">
          <v-avatar
          size="40px"
          rounded
          >
            <img
              v-if="item.image"
              :src="item.image"
            >
          </v-avatar>
        </template> 
        <template v-slot:item.cost="{ item }">
          {{ getCost(item) }}
        </template>
      </v-data-table>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-btn color="primary">
          Edit
        </v-btn>
      </v-col>
      <v-col cols="6" class="align-content-end">
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