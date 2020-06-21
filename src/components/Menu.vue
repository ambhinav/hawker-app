<template>
  <v-card
    class="mx-auto"
    max-width="344"
  >
    <v-img
      :src="store.image"
      height="200px"
    ></v-img>

    <v-card-title>
      {{ store.name }}
    </v-card-title>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        icon
        @click="toggleMenu"
      >
        <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>

        <v-card-text>
          Menu
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
export default {
  name: "Menu",
  data() {
    return {
      show: false
    }
  },
  props: ["store"],
  methods: {
    toggleMenu() {
      return this.show = !this.show
    }
  }
}
</script>

<style>

</style>