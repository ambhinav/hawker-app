<template>
  <v-footer absolute app>
    <v-container>
      <v-row class="pb-10">
        <v-col cols="6">
          <v-row class="primary--text">
            Contact
          </v-row>
          <v-row class="hidden-sm-and-down pt-2">
            <v-icon>mdi-email</v-icon>
            <div class="pl-1 subtitle">foodboysg@gmail.com</div>
          </v-row>
          <v-row class="hidden-md-and-up pt-2">
            <div class="subtitle">foodboysg@gmail.com</div>
          </v-row>
        </v-col>
        <v-col cols="6" class="pl-5">
          <v-row class="primary--text">
            Social Media
          </v-row>
          <v-row class="pt-2">
            <a href="https://www.facebook.com/FoodBoys"><v-icon>mdi-facebook</v-icon></a>
            <a href="https://www.instagram.com/foodboys.sg/"><v-icon class="pl-4">mdi-instagram</v-icon></a>
          </v-row>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row>
        <v-col cols="6">
          <v-row justify="center">
            <div class="copyright"><strong>Foodboys</strong> <v-icon>mdi-copyright</v-icon> {{ new Date().getFullYear() }} - All rights reserved. </div> 
          </v-row>
        </v-col>
        <v-col cols="6">
          <v-btn text @click="changeRoute()" class="primary--text">Terms and conditions</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  methods: {
    changeRoute() {
      this.$router.push("privacy");
    }
  }
}
</script>

<style>
.copyright {
  font-size: 12px;
}
</style>
