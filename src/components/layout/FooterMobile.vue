<template>
  <v-footer absolute app>
    <v-container>
      <v-row class="mb-5">
        <v-col cols="12">
          <v-row class="primary--text title" justify="center">
            Contact
          </v-row>
          <v-row class="hidden-md-and-up pt-5" justify="center">
            <v-icon class="pr-2">mdi-email</v-icon>
            <!-- <div class="subtitle">foodboysg@gmail.com</div> -->
            <a href="mailto:foodboysg@gmail.com">foodboysg@gmail.com</a> 
          </v-row>
        </v-col>
        <v-col cols="12" class="pl-2">
          <v-row justify="center">
            <a href="https://www.facebook.com/foodboys.sg/"><v-icon large>mdi-facebook</v-icon></a>
            <a href="https://www.instagram.com/foodboys.sg/"><v-icon large class="pl-4">mdi-instagram</v-icon></a>
          </v-row>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row>
        <v-col cols="12">
          <v-row justify="center">
            <div class="copyright"><strong>Foodboys</strong> <v-icon>mdi-copyright</v-icon> {{ new Date().getFullYear() }} - All rights reserved. </div> 
          </v-row>
        </v-col>
        <v-col cols="12">
          <v-row justify="center">
            <v-btn text @click="changeRoute()" class="primary--text caption">Terms and conditions</v-btn>
          </v-row>
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
