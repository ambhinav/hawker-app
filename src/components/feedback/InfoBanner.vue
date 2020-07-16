<template>
  <v-container>
    <v-row class="orange pa-4 text-center hidden-sm-and-down">
      <v-spacer></v-spacer>
      <v-icon class="pr-2">mdi-alert-circle</v-icon>
      <div>{{ info }}</div>
      <v-spacer></v-spacer>
    </v-row>
    <v-row class="orange pa-4 text-center hidden-md-and-up">
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
  props: ["info"]
}
</script>

<style>

</style>