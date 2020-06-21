<template>
  <div class="home">
    <v-img
      src="https://images.unsplash.com/photo-1577303935007-0d306ee638cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1325&q=80"
      lazy-src="https://picsum.photos/id/11/100/60"
      max-height="500"
      class="align-center"
    >
      <!-- <v-container fluid>
        <v-row class="white--text font-weight-bold" align="center">
          <v-spacer></v-spacer>
          <v-col>
            <div class="header justify-center">HALALE</div>
            <div class="subtitle-1">HALAL HAWKER FOOD DELIVERY - SINGAPORE</div>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </v-container> -->
    </v-img> 
    <v-timeline
      :align-top="alignTop"
      :dense="dense"
      :reverse="reverse"
    >
      <v-timeline-item
        v-for="(step, i) in timeline"
        :key="i"
        :fill-dot="fillDot"
        :hide-dot="hideDot"
        :icon="icon ? 'mdi-star' : ''"
        :icon-color=" iconColor ? 'deep-orange' : ''"
        :left="left"
        :right="right"
        :small="small"
      >
        <span slot="opposite" class="subtitle-1">{{ step.name }}</span>
        <v-card class="elevation-2">
          <v-card-title class="headline">Lorem ipsum</v-card-title>
          <v-card-text>
            Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola imperdiet nec ut, sed euismod convenire principes at.
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>
    <Markets />
  </div>
</template>

<script>
// @ is an alias to /src
import Markets from "@/components/Markets.vue";

export default {
  name: "Home",
  data () {
    return {
      timeline: [
        {
          name: "Choose a market"
        },
        {
          name: "Tell us when you want your food"
        },
        {
          name: "Choose your food and checkout"
        },
      ]  
    }
  },
  components: {
    Markets
  }
};
</script>
