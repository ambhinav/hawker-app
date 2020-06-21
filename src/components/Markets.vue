<template>
  <v-container fluid>
    <v-row class="text-center" justify="center">
      <v-col cols="12" class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Choose from our partner hawker centers!
        </h1>

        <p class="subheading font-weight-regular">
          All the stores listed on the website offer 100% halal food.
        </p>
      </v-col>
      <v-col
          v-for="(market, i) in getMarkets"
          :key="i"
          cols="12"
          lg="8"
        >
        <v-card
          max-width="500"
          class="mx-auto"
          shaped
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="headline">{{ market.name }}</v-list-item-title>
              <v-list-item-subtitle></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-img
            :src="market.image"
            max-height="300"
          ></v-img>

          <v-card-text>
            {{ market.stores.length }} shops available to choose from!
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text
              color="accent"
              prepend-icon="mdi-menu"
            >
              See Menu
            </v-btn>
          </v-card-actions>
        </v-card>     
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: "Markets",
  data: () => ({
  }),
  computed: {
    ...mapGetters({
      getMarkets: 'getMarkets'
    })
  }
};
</script>
