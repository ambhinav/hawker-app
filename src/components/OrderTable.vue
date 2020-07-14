<template>
  <v-card shaped>
    <v-card-title
        class="headline grey lighten-3 justify-center"
        primary-title
    >
      <h2>Your Order</h2>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row justify="center">
          <v-data-table
          :headers="headers"
          :items="getNewCart()"
          class="elevation-1"
          hide-default-footer
          show-expand
          >
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
        <v-row justify="space-around" align="center">
          <v-col cols="6">
            <v-text-field 
              outlined
              label="Enter promo code"
              v-model="promo"
              clearable
              class="pt-8"
            >
            </v-text-field>
          </v-col>
          <v-col cols="2">
            <v-btn color="primary" height="50px" :disabled="showRedeemButton">redeem</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <InfoBanner info="Note: Delivery fee is $6 if within 8km, else is $9." />
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="editCart" class="mr-2 mb-2">
        Edit Cart
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import InfoBanner from '@/components/feedback/InfoBanner';
export default {
  name: "OrderTable",
  components: {
    InfoBanner
  },
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
      ],
      promo: null,
      isPromoValid: false,
    }
  },
  watch: {
    // triggered when user types in a promo code
    // checks if it valids and enables the redeem button if it is
    promo(val) {
      var targetPromo = this.getPromos.find(promo => promo.code == val);
      this.isPromoValid = !!targetPromo;
    }
  },
  computed: {
    ...mapGetters(["getCart", "getMarkets", "getDeliveryDetails", "getTotalPrice", "getPromos"]),
    getMarket() {
      var targetMarket = this.getMarkets.find(market => market.id === this.getDeliveryDetails.marketId); 
      return targetMarket;
    },
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
    showRedeemButton() {
      return !this.isPromoValid;
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
      copy.push({ name: "Delivery Cost", price: this.getDeliveryCost }, { name: "Total Cost", price: this.getTotalCost })
      return copy
    }
  }
}
</script>

<style>

</style>