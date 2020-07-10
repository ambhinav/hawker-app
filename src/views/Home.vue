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
    <InfoBanner v-if="showBanner" info="Sorry, we are closed after 5pm. Please visit us tomorrow." />
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
        <v-card class="elevation-2 hidden-sm-and-down">
          <v-card-title>{{ step.title }}</v-card-title>
          <v-card-text>
            {{ step.text }}
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
import InfoBanner from '@/components/feedback/InfoBanner';
import { isClosed } from '@/utils/dateTimeUtil';

export default {
  name: "Home",
  data () {
    return {
      timeline: [
        {
          name: "Choose a market",
          title: "Markets",
          text: "Choose your favourite hawker food from all the available shops in the market!"
        },
        {
          name: "Tell us when you want your food",
          title: "Delivery Timing",
          text: "Choose when you want your food delivered and we will show you the available shops!"
        },
        {
          name: "Choose your food and checkout",
          title: "Menu and Checkout",
          text: "Add the food you want to the cart and checkout. Payment can be made via Paynow, Stripe or Cash on delivery."
        },
      ]  
    }
  },
  components: {
    Markets,
    InfoBanner
  },
  computed: {
    showBanner() {
      var x = isClosed();
      console.log(x);
      return x;
    }
  }
};
</script>
