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
        v-if="getMarket.imageUrlLarge"
        :src="getMarket.imageUrlLarge"
        lazy-src="https://images.unsplash.com/photo-1557682260-96773eb01377?ixlib=rb-1.2.1&auto=format&fit=crop&w=1315&q=80"
        max-height="500"
      >
      </v-img>
      <v-container>
        <v-row class="text-center" justify="center">
          <v-col cols="12" class="mb-4">
            <h2 class="font-weight-bold">
              {{ getMarket.name }}
            </h2>
          </v-col>
        </v-row>
        <v-row>
          <MsgBanner :items="getInfoAlert" />
        </v-row>
        <v-row>
          <v-col cols="12" :md="getStoresInMarket.length === 1 ? 12 : 6" v-for="(store, i) in getStoresInMarket" :key="i">
            <v-skeleton-loader
              v-if="loading"
              type="card"
            >
            </v-skeleton-loader>
            <Menu v-else :store="store" />
          </v-col>
        </v-row>
      </v-container>
      <v-bottom-sheet 
        v-model="show"
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
            <v-spacer></v-spacer>
            {{ !getSmallOrderFee ? "" : getSmallOrderFee.isSmallOrder ? `Small Order Fee: $${getSmallOrderFee.fee}` : "" }}
            <v-spacer></v-spacer>
            <v-btn v-if="isCartOpen" @click="toggleCartState" depressed>Open Cart</v-btn>
          </v-card-title>
          <v-card-title 
            style="font-size: 16px; font-family: 'Palanquin Dark', sans-serif;" 
            v-else class="d-flex justify-space-between"
            >
            {{getCartLength}} Items in cart 
            <v-spacer></v-spacer>
            {{ !getSmallOrderFee ? "" : getSmallOrderFee.isSmallOrder ? `Small Order Fee: $${getSmallOrderFee.fee}` : "" }}
            <v-spacer></v-spacer>
            <v-btn color="error" v-if="isCartOpen" @click="toggleCartState" depressed>Close Cart</v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text v-if="cartOpen && isCartOpen">
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
                      ${{parseFloat(item.price).toFixed(2)}}
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
          <v-btn :loading="loading" color="primary" @click="checkOut()" style="height: 50px; font-size: 15px;">
            <span style="font-family: 'Palanquin Dark', sans-serif;">Check Out - </span>
            <b>${{getTotalPrice}}</b>
          </v-btn>
          <!-- <v-card-actions>
                <div class="error--text subtitle-2 font-weight-light hidden-sm-and-down">*Note that there is a minimum spend of $4 for each shop that you buy from, and $30 overall.</div>
                <div class="error--text subtitle-2 font-weight-light hidden-md-and-up">*Note: Minimum spend of $4 for each shop purchased from, and $30 overall.</div>
                <v-spacer></v-spacer>
                <v-btn bottom :loading="loading" :disabled="!isValidPurchase" color="primary" @click="checkOut()" style="height: 50px; font-size: 15px;">
                  <span style="font-family: 'Palanquin Dark', sans-serif;">Check Out - </span>
                  <b>${{getTotalPrice}}</b>
                </v-btn>
          </v-card-actions> -->
        </v-card>
      </v-bottom-sheet>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import Menu from '@/components/Menu';
import messages from '@/utils/messages';
import { isSameDay } from '@/utils/dateTimeUtil';
import { isClosed } from '@/utils/dateTimeUtil';
import MsgBanner from '../components/feedback/MsgBanner.vue';
export default {
  name: "StoreUser",
  data () {
    return {
      deliveryDetails: null,
      cartOpen: false,
      error: false,
      loading: true,
      isCheckoutButtonShown: true,
      show: true,
    }
  },
  mounted () {
    window.addEventListener("beforeunload", this.handlePageReload);
  },
  created () {
    this.$store.cache.dispatch("initStores");
    this.deliveryDetails = this.getDeliveryDetails;
    if (!this.deliveryDetails) {
      this.error = true;
    }
    this.setUpComponent();
    var self = this; 
    setInterval(() => {
      self.isCheckoutButtonShown = !isClosed();
    }, 5000)
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
    Menu,
    MsgBanner
  },
  computed: {
    ...mapGetters({
      getMarkets: 'getMarkets',
      getStores: 'getStores',
      getCart: 'getCart',
      getCartLength: 'getCartLength',
      getTotalPrice: 'getTotalPrice',
      isCartFilled: 'isCartFilled',
      getDeliveryDetails: 'getDeliveryDetails',
      getSmallOrderFee: 'getSmallOrderFee'
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
    isValidPurchase() {
      return this.isCartFilled
    },
    isCartOpen() {
      return this.getCart.length > 0;
    },
    getInfoAlert() {
      return messages.STORE_USER;
    },
  },
  methods: {
    ...mapMutations({
      removeItemFromCart: 'removeItemFromCart',
      decrementQty: 'decrementQty',
      incrementQty: 'incrementQty',
      toggleCartState: 'toggleCartState',
      setDeliveryDetails: 'setDeliveryDetails',
      resetCartState: "resetCartState",
      setSmallOrderFee: "setSmallOrderFee"
    }),
    ...mapActions(["successToast", "errorToast"]),
    handlePageReload() {
      console.log("Here")
    },
    toggleCartState() {
      this.cartOpen = !this.cartOpen
    },
    checkOut() {
      if (this.isValidPurchase) {
        /*
        if (this.getTotalPrice < 30.00) {
          if (this.getTotalPrice < 10.00) {
            this.setSmallOrderFee({ isSmallOrder: true, fee: SMALL_ORDER_FEE_ONE });
          } else {
            this.setSmallOrderFee({ isSmallOrder: true, fee: SMALL_ORDER_FEE_TWO });
          }
        }
        */
        this.$router.push({ name: "OrderDetails" })
      } else {
        /*
        if (!this.isCartFilled && this.getTotalPrice < 30.0) {
          return this.errorToast("Please add at least $30 worth of items to cart");
        } else if (!this.isCartFilled) {
          return this.errorToast("Please add at least $4 worth of items from each store you purchased from");
        } else {
          return this.errorToast("Please add at least $30 worth of items to cart");
        }
        */
        return this.errorToast("Please add at least $4 worth of items from each store you purchased from");
      }
    },
    setUpComponent() {
      return new Promise(resolve => setTimeout(() => resolve(this.loading = false), 1000));
    }
  },
}
</script>

<style>

</style>