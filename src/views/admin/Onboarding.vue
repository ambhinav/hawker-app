<template>
  <v-card>
    <v-card-title
      class="headline grey lighten-3 justify-center"
      primary-title
    >
      <h2>Onboard a store</h2>
    </v-card-title>

    <v-card-text class="px3">
      <v-form ref="form">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field 
                label="Store name" 
                :rules="getTextRules"
                ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field 
                label="POC contact" 
                type="number"
                :rules="getTextRules"
                ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field 
                label="POC name" 
                :rules="getTextRules"
                ></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="center" align="center">
            <v-col cols="6">
              <v-img contain height="120" width="120" v-if="fileImgPath" :src="fileImgPath" class="grey lighten-2"></v-img>
            </v-col>
            <v-col cols="6">
              <v-btn  @click="onPickFile()">Pick Item Image</v-btn>
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
                :items="availableTimings"
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
import rules from '@/utils/validation';
const { required } = rules
export default {
  name: "Onboarding",
  data () {
    return {
      name: null,
      pocContact: null,
      pocName: null,
      fileImgPath: null,
      operatingTimes: null,
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
      availableTimings: [
        "11:30",
        "14:30",
        "17:00"
      ],
    }
  },
  computed: {
    getTextRules() {
      return [required];
    },
  },
  methods: {
    onPickFile() {
			this.$refs.fileInput.click()
		},
		onFilePicked(event) {
			this.file = event.target.files[0]
			var reader = new FileReader()
			reader.onload = (e) => {
				this.fileImgPath = e.target.result
			}
			reader.readAsDataURL(this.file);
    },
    handleSubmit() {
      if (this.$refs.form.validate()) {
        console.log("Submit called")
      }
    }
  }
}
</script>

<style>

</style>