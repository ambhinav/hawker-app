<template>
  <v-card shaped>
    <v-card-title
      class="headline grey lighten-3 justify-center"
      primary-title
    >
      <h2>Your delivery details:</h2>
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
                :rules="getIntRules"
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
              <v-textarea 
                label="Special instructions...e.g. Delivery, Food restrictions" 
                v-model="specialInstructions"
                ></v-textarea>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn :loading="loading" class="primary mx-0 mt-3 mr-3" text @click="handleSubmit">Submit</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import rules from "@/utils/validation";
const { required, isInt } = rules;
export default {
  name: "CustomerDetails",
  data () {
    return {
      customerName: null,
      postalCode: null,
      phoneNumber: null,
      specialInstructions: null,
      loading: false
    }
  },
  computed: {
    getTextRules() {
      return [required];
    },
    getIntRules() {
      return [isInt, required];
    }
  },
  methods: {
    handleSubmit() {
      if (this.$refs.form.validate()) {
        console.log("submitted")
      }
    }
  }
}
</script>

<style>

</style>