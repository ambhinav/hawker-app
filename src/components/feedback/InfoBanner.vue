<template>
  <v-container>
    <v-row class='pa-4 hidden-sm-and-down secondary'>
      <v-col cols="12">
        <v-row justify="center">
          <v-icon large class="pr-2">mdi-alert-circle</v-icon>
        </v-row>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12">
        <v-row :class="typography" justify="center">
          <div>{{ info }}</div>
        </v-row>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <v-row class="secondary pa-4 text-center hidden-md-and-up">
      <v-col cols="12">
        <v-icon class="pb-2">mdi-alert-circle</v-icon>
        <div>{{ info }}</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "InfoBanner",
  props: ["info", "typography"]
}
</script>

<style></style>
