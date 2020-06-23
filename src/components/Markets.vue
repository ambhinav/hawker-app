<template>
  <div>
    <v-container fluid>
      <v-row class="text-center" justify="center">
        <v-col cols="12" class="mb-4">
          <h1 class="display-2 font-weight-bold mb-3">
            Choose from our partner hawker centers!
          </h1>

          <p class="subheading font-weight-regular">
            All the stores listed on the website offer 100% halal food.
          </p>
        </v-col>
        <v-col
            v-for="(market, i) in getMarkets"
            :key="i"
            cols="12"
            lg="8"
          >
          <v-card
            max-width="500"
            class="mx-auto"
            shaped
          >
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="headline">{{ market.name }}</v-list-item-title>
                <v-list-item-subtitle></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-img
              :src="market.image"
              max-height="300"
            ></v-img>

            <v-card-text>
              {{ market.stores.length }} shops available to choose from!
            </v-card-text>
            <v-card-actions>
              <v-btn v-if="distances.length > 0" color="purple" text>
                {{ distances[i] }} km away
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
    <v-dialog v-model="deliveryDialog" max-width="600">
      <v-card>
				<v-form ref="deliveryDetailsForm">
					<v-card-title>
						<span class="headline">Choose your delivery period</span>
					</v-card-title>
					<v-card-text>
						<v-container>
              <v-row justify="center">
                <v-col cols="12">
                  <span class="subtitle red--text">Please note that delivery is not on-demand.</span>
                  <br>
                  <span class="subtitle">If you would like your food to be delivered between a certain period, please choose the relevant slot and place your order by that time</span> 
                  <v-simple-table>
                    <template>
                      <thead>
                        <tr>
                          <th class="text-left">Delivery Period (PM)</th>
                          <th class="text-left">Order By</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(timing, i) in deliveryTimings1" :key="i">
                          <td>{{ timing.period }}</td>
                          <td><b>{{ timing.orderBy }}</b></td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-col>
              </v-row>
							<v-row>
								<v-col cols="12">
                  <v-autocomplete
                    :items="deliveryTimings2"
                    v-model="deliveryTime"
                    label="Delivery Period (PM)"
                    required
                    :rules="getTextRules"
                  >
                  </v-autocomplete>
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
export default {
  name: "Markets",
  async created () {
    this.distances = await Promise.all(this.getMarkets.map(market => this.getDistanceFromMarket(market)))
  },
  data: () => ({
    deliveryDialog: false,
    loading: false,
    deliveryTime: null,
    deliveryTimings2: ["12 -2", "3 - 5", "6 - 8"], 
    deliveryTimings1: [
      { 
        orderBy: "11:30 AM",
        period: "12 - 2",
      },
      { 
        orderBy: "2:30  PM",
        period: "3 - 5",
      },
      { 
        orderBy: "5:00  PM",
        period: "6 - 8",
      }
    ], 
    slots: [
      { 
        slot: "11:30",
        period: "12 - 2",
      },
      { 
        slot: "14:30",
        period: "3 - 5",
      },
      { 
        slot: "17:00",
        period: "6 - 8",
      }
    ],
    mealType: null,
    meals: ["Breakfast", "Lunch", "Dinner"],
    targetMarket: null,
    distances: []
  }),
  computed: {
    ...mapGetters({
      getMarkets: 'getMarkets',
    }),
    getTextRules() {
      return [rules.required];
    },

    getDeliverySlot() {
      var timing = this.slots.find(timing => timing.period == this.deliveryTime);
      return timing.slot;
    },
  },
  methods: {
    ...mapMutations({
      setDeliveryDetails: 'setDeliveryDetails'
    }),
    ...mapActions(['getDistance']),
    showDeliveryDialog(marketId) {
      this.targetMarket = marketId;
      this.deliveryDialog = true;
    },
    onSubmit() {
      if (this.$refs.deliveryDetailsForm.validate()) {
        this.setDeliveryDetails({
          deliveryTime: this.getDeliverySlot,
          mealtype: this.mealType,
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
    getDistanceFromMarket(market) {
      // const callAsync = async () => {
      //   try {
      //     return await this.getDistance({ lat: market.location.latitude, lng: market.location.longitude })  
      //   } catch(err) {
      //     console.log(err)
      //   }
      // } 
      // callAsync().then(d => d).catch(e => console.log(e));
      return this.getDistance({ lat: market.location.latitude, lng: market.location.longitude })
    }
  }
};
</script>
