<template>
  <div>
    <v-container>
      <v-row class="text-center">
        <v-col cols="12" class="mb-4">
          <h1 class="font-weight-bold mb-3">
            Select 100% halal food from our Partner Hawker Centers!
          </h1>
        </v-col>
        <v-col
            v-for="(market, i) in getSortedMarkets()"
            :key="i"
            cols="12"
            md="6"
          >
          <v-skeleton-loader
            v-if="loading"
            type="card"
          >
          </v-skeleton-loader>
          <v-card
            max-width="600"
            class="mx-auto"
            shaped
            v-else
            :disabled="isMarketDisabled(market)"
          >
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="headline">{{ market.name }}</v-list-item-title>
                <v-list-item-subtitle v-if="isMarketDisabled(market)">Coming Soon!</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-img
              v-if="market.imageUrl"
              max-height="300"
              :src="market.imageUrl"
              lazy-src="https://images.unsplash.com/photo-1557682260-96773eb01377"
              @click="showDeliveryDialog(market.id)"
            >
            </v-img>
            <v-img
              v-else 
              src="https://image.shutterstock.com/image-photo/singapore-january-14-2020-inside-600w-1626451243.jpg"
              lazy-src="https://images.unsplash.com/photo-1557682260-96773eb01377"
              @click="showDeliveryDialog(market.id)"
              max-height="300"
            >
            </v-img>
            <v-card-text v-if="market.stores">
              {{ market.stores.length }} shops available to choose from!
            </v-card-text>
            <v-card-actions>
              <v-btn v-if="market.distance && !isNaN(market.distance)" text>
                Delivery cost - ${{ getDeliveryCost(market.distance) }}
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                text
                color="accent"
                prepend-icon="mdi-menu"
                @click="showDeliveryDialog(market.id)"
              >
                See Menu
              </v-btn>
            </v-card-actions>
          </v-card>     
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="deliveryDialog" max-width="600" persistent>
      <v-card>
				<v-form ref="deliveryDetailsForm">
					<v-card-title>
						<span class="headline">Choose your delivery slot</span>
					</v-card-title>
					<v-card-text>
						<v-container>
              <v-row justify="center">
                <v-col cols="12">
                  <span class="subtitle red--text">Please note stall are available according to their operating hours. Some slots may not have all stalls operating.</span>
                  <br>
                  <span class="subtitle">If you would like your food to be delivered at a certain time, please choose the relevant slot and place your order by that time</span> 
                  <v-radio-group v-model="deliveryTime" :rules="[v => !!v || 'Item is required']" required>
                    <template v-slot:label>
                      <div>Available slots</div>
                    </template>
                    <v-radio
                      v-for="(data, i) in getDeliveryTimings"
                      :key="i"
                      :label="data[1]"
                      :value="data[0]"
                    >
                      <template v-slot:label>
                        <div><b>{{data[1]}}</b></div>
                      </template>
                    </v-radio>
                  </v-radio-group>
								</v-col>
							</v-row>
						</v-container>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary darken-1" text @click="handleDeliveryDetailsClose">Close</v-btn>
						<v-btn color="primary darken-1" text @click="onSubmit">Next</v-btn>
					</v-card-actions>
				</v-form>
			</v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import rules from '@/utils/validation';
import { isBefore, isClosed } from '@/utils/dateTimeUtil';
import { deliveryTimingsData, deliveryTimingsMapping } from '@/utils/deliveryData';
export default {
  name: "Markets",
  created () {
    // var yo = () => {
    //   this.initMarkets()
    //   this.$forceUpdate()
    //   location.reload();
    // }
    // if (!(navigator.userAgent.indexOf("Safari") > -1)) { // runs code if user is NOT on IOS or Safari
    //   navigator.permissions.query({name:'geolocation'}).then(function(result) {
    //     result.onchange = () => {
    //       if (result.state == "granted") {
    //         console.log("updating...")
    //         yo();
    //       }
    //     }
    //   })
    // }
    this.setUpComponent();
  },
  data: () => ({
    deliveryDialog: false,
    deliveryTime: null,
    meals: ["Breakfast", "Lunch", "Dinner"],
    targetMarket: null,
    distances: [],
    loading: true
  }),
  computed: {
    ...mapGetters({
      getMarkets: 'getMarkets',
    }),
    getTextRules() {
      return [rules.required];
    },
    getDeliverySlot() {
      var timing = deliveryTimingsData.find(timing => timing.period == this.deliveryTime);
      return timing.slot;
    },
    /*
    getDeliveryTimings() {
      if (!isClosed()) {
        var res = [];
        lastOrderTimings.forEach(timing => {
          if (isBefore(timing.slot)) {
            res.push(timing.period);
          }
        })
        return res;
      }
      return deliveryTimingsOnly;
    },
    deliveryTimingsUI() {
      return deliveryTimingsUI;
    }
    */
    getDeliveryTimings() {
      if(!isClosed()) {
        return Object.entries(deliveryTimingsMapping).filter(data => isBefore(data[1]));
      }
      return Object.entries(deliveryTimingsMapping);
    }
  },
  methods: {
    ...mapMutations({
      setDeliveryDetails: 'setDeliveryDetails'
    }),
    ...mapActions(['getDistance', 'initMarkets']),
    showDeliveryDialog(marketId) {
      this.targetMarket = marketId;
      this.deliveryDialog = true;
    },
    onSubmit() {
      if (this.$refs.deliveryDetailsForm.validate()) {
        this.setDeliveryDetails({
          deliveryTime: this.deliveryTime,
          marketId: this.targetMarket
        })
        this.$router.push({
          name: "StoreUser",
        })
      }
    },
    handleDeliveryDetailsClose() {
      this.targetMarket = null;
      this.deliveryDialog = false;
      this.deliveryTime = null;
      this.mealType = null;
      this.$refs.deliveryDetailsForm.resetValidation();
    },
    // getDistanceFromMarket(market) {
    //   return this.getDistance({ lat: market.location.latitude, lng: market.location.longitude })
    // }
    setUpComponent() {
      return new Promise(resolve => setTimeout(() => resolve(this.loading = false), 1000));
    },
    isMarketDisabled(market) {
      return !market.enabled;
    },
    getDeliveryCost(distance) {
      return distance <= 8 ? 6 : 9;
    },
    getSortedMarkets() {
      // remove disabled markets
      var filteredMarkets = this.getMarkets.filter(market => market.enabled == true);
      // sort by number of available shops
      filteredMarkets.sort((m1, m2) => {
        return m2.stores.length - m1.stores.length;
      });
      return filteredMarkets;
    }
  }
};
</script>
