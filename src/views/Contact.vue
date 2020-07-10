<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <v-card flat>
          <v-card-title
            class="headline justify-center pa-10"
            primary-title
          >
            <v-icon large class="pr-2">mdi-phone</v-icon>
            <h2 class="primary--text">Contact us!</h2>
          </v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-container>
                <v-row justify="center">
                  <v-col cols="12" md="6">
                    <v-text-field 
                      label="Full Name" 
                      :rules="getTextRules"
                      v-model="fullName"
                      ></v-text-field>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col cols="12" md="6">
                    <v-autocomplete
                      label="Type of enquiry" 
                      :rules="getTextRules"
                      v-model="category"
                      :items="categories"
                      outlined
                      required
                      ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col cols="12" md="6">
                    <v-text-field 
                      label="Email" 
                      v-model="email"
                      :rules="getEmailRules"
                      ></v-text-field>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col cols="12" md="6">
                    <v-textarea
                      label="Details (Include order number if required)"
                      v-model="details"
                      :rules="getTextRules"
                    >
                    </v-textarea>
                  </v-col>
                </v-row>
                <v-row v-if="error">
                  <v-col cols="12">
                    <div class="error--text">There was network error, please try again soon!</div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-spacer></v-spacer>
                  <v-col cols="4">
                    <v-btn :loading="loading" class="primary" text @click="handleSubmit">submit</v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import rules from '@/utils/validation';
import { mapActions } from 'vuex';
const { required, email } = rules;
export default {
  name: "ClientContact",
  data () {
    return {
      loading: false, 
      fullName: null,
      email: null,
      category: null,
      details: null,
      categories: [
        "General",
        "Orders",
        "Partnership"
      ],
      error: false
    }
  },
  computed: {
    getTextRules() {
      return [required]
    },
    getEmailRules() {
      return [email, required]
    }
  },
  methods: {
    ...mapActions([
      "createContactRequest"
    ]),
    handleSubmit() {
      if (this.$refs.form.validate()) { // does not check if image uploaded
        this.loading = true;
        const callCreateContactRequest = async () => {
          try {
            await this.createContactRequest({
              fullName: this.fullName,
              details: this.details,
              category: this.category,
              email: this.email 
            });
            this.$router.push({ name: "ClientContactSuccess" });
          } catch (e) {
            console.log(e)
            this.error = true;
          } finally {
            this.cleanUpSubmit();
          }
        }
        callCreateContactRequest();
      }
    },
    cleanUpSubmit() {
      this.loading = false;
      this.error = false;
      this.fullName = null;
      this.details = null;
      this.category = null;
      this.email = null;
      this.$refs.form.resetValidation()
    },
  }
}
</script>

<style>

</style>