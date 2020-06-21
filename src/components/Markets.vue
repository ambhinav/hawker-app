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
						<span class="headline">Enter delivery details</span>
					</v-card-title>
					<v-card-text>
						<v-container>
							<v-row>
								<v-col cols="12">
                  <v-autocomplete
                    :items="deliveryTimings"
                    v-model="deliveryTime"
                    label="Delivery Timing"
                    required
                    :rules="getTextRules"
                  >
                  </v-autocomplete>
								</v-col>
							</v-row>
							<v-row>
								<v-col cols="12">
                  <v-autocomplete
                    :items="meals"
                    v-model="mealType"
                    label="Meal Type"
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
import { mapGetters } from 'vuex';
import rules from '@/utils/validation';
export default {
  name: "Markets",
  data: () => ({
    deliveryDialog: false,
    loading: false,
    deliveryTime: null,
    deliveryTimings: ["11:30", "14:30", "17:00"], 
    mealType: null,
    meals: ["Breakfast", "Lunch", "Dinner"],
    targetMarket: null,
  }),
  computed: {
    ...mapGetters({
      getMarkets: 'getMarkets'
    }),
    getTextRules() {
      return [rules.required];
    }
  },
  methods: {
    // ...mapMutations({
    //   setDeliveryDetails: 'setDeliveryDetails'
    // }),
    showDeliveryDialog(marketId) {
      this.targetMarket = marketId;
      this.deliveryDialog = true;
    },
    onSubmit() {
      if (this.$refs.deliveryDetailsForm.validate()) {
        this.$router.push({
          name: "StoreUser",
          params: {
            deliveryDetails: {
              deliveryTime: this.deliveryTime,
              mealtype: this.mealType,
              marketId: this.targetMarket
            }
          } 
        })
      }
    },
    handleDeliveryDetailsClose() {
      this.targetMarket = null;
      this.deliveryDialog = false;
      this.deliveryTime = null;
      this.mealType = null;
      this.$refs.deliveryDetailsForm.resetValidation();
    }
  }
};
</script>
