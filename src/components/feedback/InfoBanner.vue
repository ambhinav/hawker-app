<template>
  <v-container>
    <v-row class="orange pa-4" justify="center" align-content="center">
      <v-col cols="1"></v-col>
      <v-col cols="2">
        <v-icon>mdi-alert-circle</v-icon>
      </v-col>
      <v-col cols="8">
        <div>{{ info }}</div>
      </v-col>
      <v-col cols="1"></v-col>
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