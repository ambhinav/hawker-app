<template>
  <v-card>
    <v-card-title
      class="headline grey lighten-3 justify-center"
      primary-title
    >
      <h2>Onboard new stores</h2>
    </v-card-title>

    <v-card-text class="px3">
      <v-form ref="form">
        <v-container>
          <v-row>
            <v-col cols="6">
              <v-text-field 
                label="Store Name" 
                :rules="getTextRules"
                v-model="name"
                ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field 
                label="Store ID: <Market Code><Unit Number>" 
                :rules="getTextRules"
                v-model="storeId"
                ></v-text-field>
            </v-col> 
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Unit number"
                :rules="getTextRules"
                v-model="stallNumber"
              >
              </v-text-field>
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                label="Market Name" 
                :rules="getTextRules"
                v-model="marketName"
                :items="getProcessedMarkets"
                outlined
                required
                ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field 
                label="POC Contact" 
                type="number"
                v-model="pocContact"
                :rules="getTextRules"
                ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field 
                label="POC Name" 
                v-model="pocName"
                :rules="getTextRules"
                ></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="center" align="center">
            <v-col cols="6">
              <v-img contain height="120" width="120" v-if="fileImgPath" :src="fileImgPath" class="grey lighten-2"></v-img>
            </v-col>
            <v-col cols="6">
              <v-btn  @click="onPickFile()">Pick Store Image</v-btn>
              <input type="file" 
              style="display: none" 
              name="" id="" 
              ref="fileInput" 
              accept="image/*"
              @change="onFilePicked">
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-autocomplete
                v-model="operatingTimes"
                :items="daysOfWeek"
                outlined
                dense
                chips
                small-chips
                label="Operating Times"
                multiple
                required
                :rules="getTextRules"
              ></v-autocomplete>
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                v-model="deliveryTimings"
                :items="getDeliverySlots"
                outlined
                dense
                chips
                small-chips
                label="Delivery Timings"
                multiple
                required
                :rules="getTextRules"
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn :loading="loading" class="primary mx-0 mt-3 mr-3" text @click="handleSubmit">Add store</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import rules from '@/utils/validation';
const { required } = rules;
import { deliverySlots } from '@/utils/deliveryData.js';
export default {
  name: "Onboarding",
  data () {
    return {
      name: null,
      marketName: null,
      pocContact: null,
      pocName: null,
      fileImgPath: null,
      operatingTimes: null,
      stallNumber: null,
      daysOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      deliveryTimings: null,
      storeId: null,
      loading: false
    }
  },
  computed: {
    getTextRules() {
      return [required];
    },
    ...mapGetters({
      getMarkets: 'getMarkets'
    }),
    getProcessedMarkets() {
      return this.getMarkets.map(market => market.name)
    },
    getDeliverySlots() {
			return deliverySlots;
		}
  },
  methods: {
    ...mapActions({
      createStore: 'createStore',
      successToast: 'successToast',
      errorToast: 'errorToast'
    }),
    onPickFile() {
			this.$refs.fileInput.click()
		},
		onFilePicked(event) {
			this.file = event.target.files[0];
			var reader = new FileReader();
			reader.onload = (e) => {
				this.fileImgPath = e.target.result;
			}
			reader.readAsDataURL(this.file);
    },
    handleSubmit() {
      if (this.$refs.form.validate()) { // does not check if image uploaded
        this.loading = true;
        const callCreateStore = async () => {
          try {
            await this.createStore({
              name: this.name,
              deliveryTimings: this.deliveryTimings,
              operatingTimes: this.operatingTimes,
              pocName: this.pocName,
              pocContact: this.pocContact,
              image: this.file,
              storeId: this.storeId,
              marketId: this.getTargetMarketId(this.marketName),
              stallNumber: this.stallNumber
            });
            this.successToast("Store created!")
          } catch (e) {
            console.log(e)
            this.errorToast("Error creating store")
          } finally {
            this.cleanUpSubmit()
          }
        }
        callCreateStore()
      }
    },
    cleanUpSubmit() {
      this.loading = false;
      this.marketName = null;
      this.storeId = null;
      this.pocContact = null;
      this.pocName = null;
      this.name = null;
      this.deliveryTimings = null;
      this.file = null;
      this.operatingTimes = null;
      this.stallNumber = null;
      this.$refs.form.resetValidation()
    },
    getTargetMarketId(marketName) {
      var target = this.getMarkets.find(market => market.name === marketName);
      return target.id;
    }
  }
}
</script>

<style>

</style>