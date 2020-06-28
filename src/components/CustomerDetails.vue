<template>
  <div>
    <v-card shaped>
      <v-card-title
        class="headline grey lighten-3 justify-center"
        primary-title
      >
        <h2>Your Delivery Details</h2>
      </v-card-title>

      <v-card-text class="px3">
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field 
                  label="Full Name" 
                  :rules="getTextRules"
                  v-model="customerName"
                  required
                  ></v-text-field>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="4">
                <v-btn v-if="!deliveryAddress" @click="showAddressDialog = true">
                  add address
                </v-btn>
                <v-btn v-else @click="handleEditAddress">
                  edit address
                </v-btn>
              </v-col>
            </v-row>
            <v-row v-if="deliveryAddress">
              <v-col cols="12">
                Address: <b>{{ deliveryAddress }}</b>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field 
                  label="Phone Number" 
                  type="number"
                  v-model.number="phoneNumber"
                  :rules="getIntRules"
                  required
                  ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  label="Payment Method" 
                  v-model="paymentMethod"
                  :rules="getTextRules"
                  :items="paymentMethods"
                  required
                  ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
        <v-list-item two-line class="caption font-weight-light">
          <v-list-item-content>
            <v-list-item-title>
              By sharing your data with us you are protected by <a href="https://sso.agc.gov.sg/SL-Supp/S398-2020/Published/20200528?DocDate=20200528">PDPA</a>
            </v-list-item-title>
            <v-list-item-subtitle>
              <a>Halale's Terms of Service</a>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item> 
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :loading="loading" class="primary mx-0 mt-3 mr-3" text @click="handleSubmit">Place order</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="showAddressDialog" max-width="600">
      <v-form ref="addressForm">
        <v-card>
          <v-card-title>Confirm your delivery address</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                    :items="getResults"
                    :loading="loading"
                    v-model="deliveryAddress"
                    label="Address"
                    required
                    :rules="getTextRules"
                    :search-input.sync="search"
                    prepend-icon="mdi-search"
                  >
                </v-autocomplete>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="handleAddressClose" color="primary">close</v-btn>
            <v-btn @click="handleConfirmAddress" color="primary">confirm</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>
import rules from "@/utils/validation";
const { required, isInt, isPostalCode, isNumber } = rules;
export default {
  name: "CustomerDetails",
  data () {
    return {
      customerName: null,
      postalCode: null,
      phoneNumber: null,
      loading: false,
      paymentMethod: null,
      paymentMethods: [
        "Cash on delivery",
        "Paynow",
        "Stripe",
      ],
      showAddressDialog: false,
      deliveryAddress: null,
      results: [],
      search: null,
      isEditing: false,
    }
  },
  watch: {
    search (val) {
      // Items have already been requested
      if (this.loading) return

      this.loading = true

      // Lazily load input items
      fetch(`https://developers.onemap.sg/commonapi/search?searchVal=${val}&returnGeom=Y&getAddrDetails=Y&pageNum=1`)
        .then(res => res.json())
        .then(res => {
          const { results } = res
          this.results = results.slice(0, 5) // get first 5 entries
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => this.loading = false);
    },
  },
  computed: {
    getTextRules() {
      return [required];
    },
    getPostalCodeRules() {
      return [isPostalCode, isInt, required];
    },
    getIntRules() {
      return [isNumber, required]
    },
    getResults() {
      return this.results.map(res => res["ADDRESS"]);
    }
  },
  methods: {
    handleSubmit() {
      if (this.$refs.form.validate()) {
        console.log("submitted")
      }
    },
    handleAddressClose() {
      this.results = [];
      this.showAddressDialog = false;
      if (!this.isEditing) {
        this.search = null;
        this.deliveryAddress = null;
      }
    },
    handleConfirmAddress() {
      // TODO: calculate delivery cost
      this.results = [];
      this.showAddressDialog = null;
    },
    handleEditAddress() {
      this.isEditing = true;
      this.showAddressDialog = true;
    }
  },
}
</script>
