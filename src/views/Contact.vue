<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col class="hidden-sm-and-down" md="6">
        <!-- <v-img
          src="https://uce44a600cd7584f0cdd94ec915c.previews.dropboxusercontent.com/p/thumb/AA6bNPWkEtiPVz0Jnppa1heOWwqPb0lIFI0ggWotlOOIvW15ENLBL2CweEEy7FLBYGSOo1hwRDxc75ANwjzA3bHxOKd8S8NuNtG5HQtTVx0rjAy1xRrqJ4LX4syWsTMJUXkmdXJY1jhqNtilnaik-XkuEEbiw2gvWNhFmjBa3Y5CEEH_QcqEMgUMhlTZ9RwlzqrKE6V6AzDNPMmdkLmYLgGhsu6BsIWzcyadcS5kTJq6iu-SoktCUVIUDa0pzQSyRRgZ13_MKy7MUCe23iH2X1DOCP_2PaggQqFbXJO4u5ggzGBZjsS3zz_6pL1-jDtIR5l3CR-466JyQ58ZhZtrG-tIbLJ2zwSwYhSiH18rzm23t8EWsOcaffkyqvQr-sfoYspJdqV7fFPeAZUkUxUikOinmOEISBGy0hlnPasMwEtchYWqodOhQi98pw-nqWdmMGCqZYDVQycX5xHkn1xU6qcE4qyVE2wIxMKxAJ1y-BpB8A/p.jpeg?fv_content=true&size_mode=5"
          style="transform: rotate(90deg)"
          max-width="500px"
        > -->
        <v-img
          src="https://uccd945c220a81a21805befec652.previews.dropboxusercontent.com/p/thumb/AA6Vqa27sDT5oIvpEfNTbYuW2EJ8xOdF2p9NmGINiuuij5GLEjhwb-wENnqKs8D17ncUfqoKq4dMiAipw3MInowF2EZKkAuTmXHFjb-P_amnde7wUNjzM9O2HF-oB9bWkoO9HlOnCX1zlmjRrTfbw3cSQ0UAnQQ-v1VM6FWeYRUEcGSn18tPGTdiXkiOuqBDnrajUQoS_mduyGn8pwQdoZW6e1BEeu4-iSrj5zxeFLXvdf2E77OqnHO01uXLYIj_GnPnWCDwjQvhRY2VWsoloXq5eE49LAwt4i9hMJIURont2FdHUGDpnv8PK4WRwM8Xr9jmXWElSh33PmzbynVpgZmFLhdz0GTs0bo2fslNJ6r1Dfwug4wrAm6vItCt-irffOQ9Sd1YIOmEsuIUHp_n7tgdvjbgD_QtFXcgT_CfQoQY_BJRJtdMV8G4fnIG3Qar_fuNgMe0N_dzYqNCfhPj-tDAYGIC675JDCwWUyu7mVQCmnvdtejDTcmE6Y10SwDYI9WxZ7Z3S_YaDX_c8kx_Zm7nETKk8oTbGrSBIKdyU6wgotOkfYuw6xVYlRxrI6S1k76WUzpQx2eEGMGT9MRikqCbg--qcm6f1qw1gez_TEJjEg/p.jpeg?fv_content=true&size_mode=5"
        >
        </v-img>
      </v-col>
      <v-col cols="12" md="6">
        <v-card flat class="pt-md-5">
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
                  <v-col cols="12" md="10">
                    <v-text-field 
                      label="Full Name" 
                      :rules="getTextRules"
                      v-model="fullName"
                      ></v-text-field>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col cols="12" md="10">
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
                  <v-col cols="12" md="10">
                    <v-text-field 
                      label="Email" 
                      v-model="email"
                      :rules="getEmailRules"
                      ></v-text-field>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col cols="12" md="10">
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