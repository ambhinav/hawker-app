<template>
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
          <v-row>
            <v-col cols="6">
              <v-text-field 
                label="Postal Code" 
                type="number"
                v-model.number="postalCode"
                :rules="getPostalCodeRules"
                required
                ></v-text-field>
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
      ]
    }
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
    }
  },
  methods: {
    handleSubmit() {
      if (this.$refs.form.validate()) {
        console.log("submitted")
      }
    }
  },
}
</script>
