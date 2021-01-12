<template>
  <v-card flat>
    <v-card-title
      class="headline grey lighten-3 justify-center"
      primary-title
    >
      <h2>Onboard new Market</h2>
    </v-card-title>
    <v-form ref="form">
      <v-container fluid>
        <v-row justify="space-around">
          <v-cols>
            <v-text-field
              v-model="name"
              label="Name"
              :rules="getTextRules"
              required
            >
            </v-text-field>
          </v-cols>
          <v-cols>
            <v-text-field
              v-model="postalCode"
              label="Postal code"
              type="number"
              :rules="getPostalCodeRules"
              required
            >
            </v-text-field>
          </v-cols>
          <v-cols>
            <v-text-field
              v-model="address"
              label="Address (with postal)"
              :rules="getTextRules"
              required
            >
            </v-text-field>
          </v-cols>
          <v-cols>
            <v-text-field
              v-model="marketId"
              label="Market ID"
              :rules="getTextRules"
              required
            >
            </v-text-field>
          </v-cols>
        </v-row>
        <v-row justify="center" align="center">
            <v-col cols="12" sm="6">
              <v-img contain height="120" width="120" v-if="fileImgPath" :src="fileImgPath" class="grey lighten-2"></v-img>
            </v-col>
            <v-col cols="12" sm="6">
              <v-btn  @click="onPickFile()">Pick Market Image</v-btn>
              <input type="file" 
              style="display: none" 
              name="" id="" 
              ref="fileInput" 
              accept="image/*"
              @change="onFilePicked">
            </v-col>
          </v-row>
      </v-container>
    </v-form>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn :loading="loading" class="primary mx-0 mt-3 mr-3" text @click="handleSubmit">Add Market</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import rules from '@/utils/validation';
import { mapActions } from 'vuex';
const { required, isPostalCode } = rules;
export default {
  name: "OnboardMarket",
  data() {
    return {
      postalCode: null,
      name: null,
      address: null,
      loading: false,
      marketId: null,
      file: null,
      fileImgPath: null
    }
  },
  computed: {
    getTextRules() {
      return [required];
    },
    getPostalCodeRules() {
      return [isPostalCode,required];
    },
  },
  methods: {
    ...mapActions(["createMarket","successToast","errorToast"]),
    handleSubmit() {
      if(this.$refs.form.validate()) {
        this.loading = true;
        const callCreateMarket = async () => {
          try {
            await this.createMarket({
              id: this.marketId.toUpperCase(),
              image: this.file,
              postalCode: this.postalCode,
              address: this.address.toUpperCase(),
              name: this.name
            })
            this.successToast("Created Market Successfully!")
          } catch(error) {
            console.log(error);
            this.errorToast("Error creating Market, please check data");
          } finally {
            this.handleSubmitEnd();
          }
        };
        callCreateMarket();
      }
    },
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
    handleSubmitEnd() {
      this.fileImgPath = null;
      this.file = null;
      this.loading = false;
      this.$refs.form.resetValidation();
    }
  }
}
</script>

<style>

</style>