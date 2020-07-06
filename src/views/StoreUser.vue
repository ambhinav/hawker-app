<template>
  <div>
    <div v-if="error">
      <v-row justify="center mt-16">
        <h1 class="justify-content-center">
          Sorry, there are no stores available for this market based on your options.
        </h1>
        <br>
        <h2>
          Please navigate to the home page and try again.
        </h2>
      </v-row>
    </div>
    <div v-else>
      <v-img
        :src="getMarket.image"
        max-height="400"
        class="align-content-end"
      >
        <v-row align="end" class="lightbox green--text pa-2 fill-height">
          <v-col>
            <h1>
              {{ getMarket.name }}
            </h1>
          </v-col>
        </v-row> 
    </v-img>
    <v-container>
      <v-row class="text-center" justify="center">
        <v-col cols="12" class="mb-4">
          <h2 class="font-weight-bold">
            {{ getMarket.name }} shops
          </h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" :md="getStoresInMarket.length === 1 ? 12 : 6" v-for="(store, i) in getStoresInMarket" :key="i">
          <Menu :store="store" />
        </v-col>
      </v-row>
    </v-container>
    <v-bottom-sheet 
      v-model="sheet"
      hide-overlay
      inset
      persistent
      scrollable
      no-click-animation
    >
      <v-card>
        <v-card-title 
          style="font-size: 16px; font-family: 'Palanquin Dark', sans-serif;" 
          v-if="!cartOpen" 
          class="d-flex justify-space-between"
          >
          {{getCartLength}} Items in cart 
          <v-btn v-if="isCartFilled" @click="toggleCartState" depressed>Open Cart</v-btn>
        </v-card-title>
        <v-card-title 
          style="font-size: 16px; font-family: 'Palanquin Dark', sans-serif;" 
          v-else class="d-flex justify-space-between"
          >
          {{getCartLength}} Items in cart 
          <v-btn color="error" v-if="isCartFilled" @click="toggleCartState" depressed>Close Cart</v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text v-if="cartOpen && isCartFilled">
          <v-list>
            <v-list-item-group>
              <v-list-item 
              v-for="(item, i) in getCart"
              :key="i"
              class="justify-md-space-between justify-sm-space-between"
              >
              <v-list-item-content class="hidden-sm-and-down">
                  <v-avatar size="36px" style="margin-left: 5px;">    
                      <img v-if="item.image"
                          :src="item.image"
                      >
                  </v-avatar>    
              </v-list-item-content>
              <v-list-item-content class="hidden-sm-and-down">
                  {{item.name}}
              </v-list-item-content>
              <v-list-item-content class="hidden-sm-and-down">
                  ${{item.price}}
              </v-list-item-content>
              <v-list-item-content class="hidden-sm-and-down">
                  <v-btn v-if="item.qty > 1" x-small fab dark color="primary" @click="decrementQty(item)">
                    <v-icon dark>mdi-minus</v-icon>
                  </v-btn> 
                  <!-- <v-list-item-title v-text="item.qty"></v-list-item-title> -->
                  <v-btn text>
                    <span>{{ item.qty }}</span>
                  </v-btn>
                  <v-btn x-small fab dark color="primary" @click="incrementQty(item)">
                    <v-icon dark>mdi-plus</v-icon>
                  </v-btn>
              </v-list-item-content>
              <v-list-item-content class="hidden-sm-and-down">
                  <v-btn depressed @click="removeItemFromCart(item)"><v-icon>mdi-delete</v-icon></v-btn>
              </v-list-item-content>
              <v-list-item-content class="hidden-md-and-up">
                <v-row justify="center">
                  <v-col cols="4">
                    {{item.name}}
                  </v-col>
                  <v-col cols="3">
                    ${{item.price}}
                  </v-col>
                  <v-col cols="3">
                    <v-icon class="pr-2" v-if="item.qty > 1" color="primary" @click="decrementQty(item)" x-small dark>mdi-minus</v-icon>
                    <span>{{ item.qty }}</span>
                    <v-icon class="pl-2" color="primary" @click="incrementQty(item)" x-small dark>mdi-plus</v-icon>
                  </v-col>
                  <v-col cols="2">
                    <v-icon small @click="removeItemFromCart(item)">mdi-delete</v-icon>
                  </v-col>
                </v-row>
              </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>
        <v-btn :loading="loading" v-if="isCartFilled" color="primary" @click="checkOut()" style="height: 50px; font-size: 15px;">
          <span style="font-family: 'Palanquin Dark', sans-serif;">Check Out - </span>
          <b>${{getTotalPrice}}</b>
        </v-btn>
      </v-card>
    </v-bottom-sheet>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import Menu from '@/components/Menu';
import { isSameDay } from '@/utils/dateTimeUtil';
export default {
  name: "StoreUser",
  data () {
    return {
      deliveryDetails: null,
      loading: false,
      sheet: true,
      cartOpen: false,
      error: false,
    }
  },
  mounted () {
    window.addEventListener("beforeunload", this.handlePageReload);
  },
  created () {
    this.deliveryDetails = this.getDeliveryDetails;
    if (!this.deliveryDetails) {
      this.error = true;
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name == "OrderDetails") {
        next()
    } else {
      const answer = window.confirm(
      "Do you really want to leave? You're order won't be saved!"
      );
      if (answer) {
        this.resetCartState();
        next();
      } else {
        next(false);
      }
    }
  },
  components: {
    Menu
  },
  computed: {
    ...mapGetters({
      getMarkets: 'getMarkets',
      getStores: 'getStores',
      getCart: 'getCart',
      getCartLength: 'getCartLength',
      getTotalPrice: 'getTotalPrice',
      isCartFilled: 'isCartFilled',
      getDeliveryDetails: 'getDeliveryDetails'
    }),
    getMarket() {
      return this.getMarkets.find(market => market.id === this.deliveryDetails.marketId)
    },
    getStoresInMarket() {
      var copy = JSON.parse(JSON.stringify(this.getStores))
      var allStores = copy.filter(store => {
        return this.getMarket.stores.find(targetStore => targetStore === store.id);
      })
      allStores.forEach(store => {
        if (store.enabled) { // skip those that are already disabled
          if (!isSameDay(store.operatingTimes) || !store.deliveryTimings.includes(this.deliveryDetails.deliveryTime)) {
            store.enabled = false;
          }
        }
      })
      return allStores;
    },
  },
  methods: {
    ...mapMutations({
      removeItemFromCart: 'removeItemFromCart',
      decrementQty: 'decrementQty',
      incrementQty: 'incrementQty',
      toggleCartState: 'toggleCartState',
      setDeliveryDetails: 'setDeliveryDetails',
      resetCartState: "resetCartState"
    }),
    handlePageReload() {
      console.log("Here")
    },
    toggleCartState() {
      this.cartOpen = !this.cartOpen
    },
    checkOut() {
      this.$router.push({ name: "OrderDetails" })
    },
  },
}
</script>

<style>

</style>