<template>
  <v-footer absolute class="font-weight-medium" app>
    <v-container>
      <v-row class="pb-10">
        <v-col cols="6">
          <v-row class="primary--text">
            Contact
          </v-row>
          <v-row class="hidden-sm-and-down pt-2">
            <v-icon>mdi-email</v-icon>
            <div class="pl-1 subtitle">sales.halale@gmail.com</div>
          </v-row>
          <v-row class="hidden-md-and-up pt-2">
            <div class="subtitle">sales.halale@gmail.com</div>
          </v-row>
        </v-col>
        <v-col cols="6" class="pl-5">
          <v-row class="primary--text">
            Social Media
          </v-row>
          <v-row class="pt-2">
            <v-icon>mdi-facebook</v-icon>
            <v-icon class="pl-4">mdi-instagram</v-icon>
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
      </v-row>
    </v-container>
  </v-footer>
</template>

<style>
.copyright {
  font-size: 12px;
}
</style>
