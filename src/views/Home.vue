<template>
  <div class="home">
    <!-- 10 x 2 banner -->
    <v-img
      src="https://firebasestorage.googleapis.com/v0/b/halale-56586.appspot.com/o/websitePics%2F10x4_banner.jpg?alt=media&token=051cfbfb-a6b5-421c-be7e-87b6122d6128"
      lazy-src="https://images.unsplash.com/photo-1577303935007-0d306ee638cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1325&q=80"
      class="align-center hidden-sm-and-down"
      contain
      max-height="450"
    >
    </v-img> 
    <!-- 3 x 2 banner -->
    <v-img
      src="https://firebasestorage.googleapis.com/v0/b/halale-56586.appspot.com/o/websitePics%2F3x2_banner.jpg?alt=media&token=3e69a2e0-465c-4c33-a2a8-62b9d9a09762"
      lazy-src="https://images.unsplash.com/photo-1577303935007-0d306ee638cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1325&q=80"
      class="align-center hidden-md-and-up"
      contain
    >
    </v-img>
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
    <InfoBanner v-if="isSiteClosed" info="Sorry, we are closed after 5pm. Please check our menu and come back tomorrow to order!" />
    <v-timeline
      :align-top="alignTop"
      :dense="dense"
      :reverse="reverse"
      class="pa-5"
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
  created () {
    var self = this; 
    setInterval(() => {
      self.isBannerShown = isClosed();
    }, 5000)
  },
  data () {
    return {
      timeline: [
        {
          name: "Choose a food centre",
          title: "Food Centres",
          text: "Choose your favourite halal hawker food from all the available shops in the food centre!"
        },
        {
          name: "Tell us when you want your food",
          title: "Delivery Timing",
          text: "Choose when you want your food delivered and we will show you the available shops!"
        },
        {
          name: "Select your food and checkout",
          title: "Menu and Checkout",
          text: "Add the food you want to the cart and checkout. Payment can be made via Paynow or Cash on delivery."
        },
      ],
      isBannerShown: false,  
    }
  },
  components: {
    Markets,
    InfoBanner
  },
  computed: {
    isSiteClosed() {
      return this.isBannerShown;
    } 
  },
  beforeDestroy () {
    clearInterval();
  }
};
</script>
