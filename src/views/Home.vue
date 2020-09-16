<template>
  <div class="home">
    <v-img
      src="https://uc1bf508601f7266dc3861dcdf09.previews.dropboxusercontent.com/p/thumb/AA4S5xd16AcXJoeq6eCDSjcvI2s1g0hRw8kSiRRlmRjwovwNizHX2dpP5kSFhyBbtlEytG6GwbhwTtK7sgh7ZVc7He88U7zq-FoItcr_VZYauXXQ8WnJO1O1ZzumiNpm4KAQcxw6t2HR74-TwJGIhB-oq3xBS2uYz_PWBLVQ9vCLxLA2HvD5io2t-PJn3WE5U_xQ_rVtorX-zJu4lrcg-TqdqUWRRL7neRAuSygAfPfsUggFrKsx6DRFguZBG3vUqyKGGhT9D2ZXCWYYG_IgqWgGNzBZJrNlFSE7xf7UMIBXiCySXh5EII3lFinSOigCLYzDFaPJcfwlr8slVaO9gC2qAwnejHHucbATuRXd0lQv8YWsAi-3fCTmBvSH1F0K6CMC40TsMMCNy5HeNvpN8DDgQlGph6tu6VFZHssGU8Sx1g/p.jpeg?fv_content=true&size_mode=5"
      lazy-src="https://images.unsplash.com/photo-1577303935007-0d306ee638cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1325&q=80"
      class="align-center hidden-sm-and-down"
      contain
    >
    </v-img> 
    <v-img
      src="https://uc8d5934d20b2e30f9c5deeb9d1b.previews.dropboxusercontent.com/p/thumb/AA6S5He8EKIVnfT4mm3dGIB6hcU_IfiBMa3p7SKV1FKfg4m7ZBmvZ3q6ln5jm_g4vNg_eo_IxwoO2dbgypv1C6pNr2xlceJgjHnyRf7PdCNaH-_EBzRST1tLAWnOdoVnLs61_nncYwFioRdKT3a6179dgx9PNqjprtHY8bv9JeCffmUWV2bX9PHfyZil_cKEkbtdDYoVgMjgNiqRCCNi8zoDHqM70IHP-WU0dzhxum38vre9aJ3KgM_vDuQojYinJvpWfrCmKGIipAfgaFsHwnOi0roLIVgY8Cg0bUDHcWcwmxaE0PCSSMCfD5kh74jIGIfsHls0lG0Ml6XEEC1brj0tiqfB2rF_OEFEPESq1D7VDDknD86YofxVvOF5BB0S7MOLcuDpYOHF0b5E30SUfr-PTXHjBIBt7cJbSMXU1s2FryXg0xn-jpXvhCZZPGFARnO6xm62shKY07DNP62AyN76p3UdmaBENy69mU05N-S2mg/p.jpeg?fv_content=true&size_mode=5"
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
