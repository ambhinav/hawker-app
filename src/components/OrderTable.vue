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
          :items="getCheckoutDetails"
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
              {{ item.name == "Delivery Cost" || item.name == "Total Cost" || item.name == "Promo Code" ? item.price : getCost(item) }}
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
            <v-btn color="primary" @click="redeemPromo" height="50px" :disabled="!showRedeemButton">redeem</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <InfoBanner info="Delivery fee is $6 if within 8km or $9 for more than 8km away." />
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
import { mapGetters, mapMutations, mapActions } from 'vuex';
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
      targetPromo: null,
    }
  },
  watch: {
    // triggered when user types in a promo code
    // checks if it valids and enables the redeem button if it is
    promo(val) {
      var filteredPromo = this.getFilteredPromos.find(promo => promo.code == val);
      if (filteredPromo) {
        this.isPromoValid = true;
        this.targetPromo = filteredPromo;
      } else {
        this.isPromoValid = false;
      }
    }
  },
  computed: {
    ...mapGetters(["getCart", "getMarkets", "getPromos", "getRedeemedPromo", "getCheckoutDetails"]),
    getMarket() {
      var targetMarket = this.getMarkets.find(market => market.id === this.getDeliveryDetails.marketId); 
      return targetMarket;
    },
    showRedeemButton() {
      return this.isPromoValid && !this.isPromoRedeemed;
    },
    isPromoRedeemed() {
      return Object.keys(this.getRedeemedPromo).length > 0;
    },
    getFilteredPromos() {
      return this.getPromos.filter(promo => promo.enabled == true);
    },
  },
  methods: {
    ...mapMutations(["setRedeemedPromo"]),
    ...mapActions(["successToast", "errorToast"]),
    getCost(item) {
      return parseFloat(parseFloat(item.price) * parseInt(item.qty)).toFixed(1);
    },
    editCart() {
      this.$router.push("/store");
    },
    redeemPromo() {
      if (this.targetPromo.qty < 1) { // just in case they are redeemed by another user in real time
        this.errorToast("Promo code fully redeemed!");
      }
      this.setRedeemedPromo(this.targetPromo);
      this.successToast("Promo code redeemed!");
      this.isPromoValid = false;
      this.promo = null;
    }
  }
}
</script>

<style>

</style>