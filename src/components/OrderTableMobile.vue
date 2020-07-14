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
          :mobile-breakpoint="300"
          show-expand
          >
            <template v-slot:item.cost="{ item }">
              {{ item.name == "Delivery Cost" || item.name == "Total Cost" || item.name == "Promo Code" ? item.price : getCost(item) }}
            </template>
            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length" v-if="item.specialInstructions">Instruction: {{ item.specialInstructions }}</td>
            </template>
          </v-data-table>
        </v-row>
        <v-row justify="space-around" align="center">
          <v-col cols="8">
            <v-text-field 
              outlined
              label="Promo Code"
              v-model="promo"
              clearable
              class="pt-8"
            >
            </v-text-field>
          </v-col>
          <v-col cols="4">
            <v-btn color="primary" @click="redeemPromo" height="50px" :disabled="!showRedeemButton">redeem</v-btn>
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
      snackbar: false,
    }
  },
  watch: {
    // triggered when user types in a promo code
    // checks if it valids and enables the redeem button if it is
    promo(val) {
      var filteredPromo = this.getPromos.find(promo => promo.code == val);
      if (filteredPromo) {
        this.isPromoValid = true;
        this.targetPromo = filteredPromo;
      } else {
        this.isPromoValid = false;
      }
    }
  },
  computed: {
    ...mapGetters(["getCart", "getMarkets", "getDeliveryDetails", "getTotalPrice", "getPromos", "getRedeemedPromo"]),
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
      return this.isPromoValid && !this.isPromoRedeemed;
    },
    isPromoRedeemed() {
      return Object.keys(this.getRedeemedPromo).length > 0;
    }
  },
  methods: {
    ...mapMutations(["setRedeemedPromo"]),
    ...mapActions(["successToast", "errorToast"]),
    getCost(item) {
      return parseFloat(item.price) * parseInt(item.qty);
    },
    editCart() {
      this.$router.push("/store");
    },
    getNewCart() {
      let copy = [];
      if (this.isPromoRedeemed) {
        copy = JSON.parse(JSON.stringify(this.getCart));
        copy.push({ 
            name: "Delivery Cost", 
            price: this.getDeliveryCost
          },
          {
            name: "Promo Code",
            price: `- ${this.getRedeemedPromo.discount}`
          },
          { 
            name: "Total Cost", 
            price: this.getTotalCost 
        })
        return copy;
      }
      copy = JSON.parse(JSON.stringify(this.getCart));
      copy.push({ name: "Delivery Cost", price: this.getDeliveryCost }, { name: "Total Cost", price: this.getTotalCost })
      return copy
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