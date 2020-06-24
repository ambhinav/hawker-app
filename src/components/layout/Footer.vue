<template>
  <v-footer absolute class="font-weight-medium" app>
    <v-container>
      <v-row>
        <v-col cols="6" class="pl-2">
          <v-row class="primary--text">
            Information
          </v-row>
          <v-row>
            <strong>Halale</strong> <v-icon>mdi-copyright</v-icon> {{ new Date().getFullYear() }}, all rights reserved. 
          </v-row>
        </v-col>
        <v-divider vertical inset></v-divider>
        <v-col cols="5" class="pl-8">
          <v-row class="primary--text">
            Contact
          </v-row>
          <v-row class="hidden-sm-and-down">
            <v-icon>mdi-email</v-icon>
            <div class="pl-1 subtitle">sales.halale@gmail.com</div>
          </v-row>
          <v-row class="hidden-md-and-up">
            <div class="subtitle">sales.halale@gmail.com</div>
          </v-row>
          <v-row class="primary--text pt-2">
            Social Media
          </v-row>
          <v-row class="pt-1">
            <v-icon>mdi-facebook</v-icon>
            <v-icon class="pl-4">mdi-instagram</v-icon>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>
