<template>
  <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>Halale Login</v-toolbar-title>
              </v-toolbar>
              <v-form ref="form" @submit="submit">
                <v-card-text>
                    <v-text-field
                      label="Email"
                      v-model="email"
                      prepend-icon="mdi-account"
                      required
                      :rules="getEmailRules()"
                      type="text"
                    ></v-text-field>

                    <v-text-field
                      id="password"
                      label="Password"
                      v-model="password"
                      required
                      prepend-icon="mdi-lock"
                      :rules="getTextRules()"
                      type="password"
                    ></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn :loading="loading" type="submit" depressed >Login</v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import rules from '@/utils/validation';
const { required, email } = rules

export default {
  name: "SignIn",
  data () {
    return {
      email: null,
      password: null,
      loading: false,
    }
  },
  methods: {
    ...mapActions({
      successToast: "successToast",
      errorToast: "errorToast",
      logIn: "logIn"
    }),
    submit(event) {
      event.preventDefault()
      console.log("email", this.email)
      if (this.$refs.form.validate()) {
        const callLogIn = async () => {
          try {
            this.loading = true;
            await this.logIn({ 
              email: this.email, 
              password: this.password 
            });
            this.successToast("Signed in successfully");
            this.$router.push("/admin")
          } catch (e) {
            console.log(e)
            this.errorToast("Error signing in")
          } finally {
            this.loading = false;
          }
        }
        callLogIn()
      }
    },
    getTextRules() {
      return [required];
    },
    getEmailRules() {
      return [required, email];
    }
  },
};
</script>

<style></style>
