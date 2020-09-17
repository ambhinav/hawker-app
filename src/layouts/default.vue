<template>
  <v-app>
    <Navbar />
    <SnackbarSuccess v-if="status == 'success'" /> 
    <SnackbarFailure v-else-if="status == 'failure'" />
    <v-main>
      <router-view />
    </v-main>
    <FooterWrapper />
  </v-app>
</template>

<script>
import Navbar from "@/components/layout/Navbar";
import FooterWrapper from "@/components/layout/FooterWrapper";
import { mixinDetectingMobile } from "@/components/layout/MobileMixin.js";
import SnackbarSuccess from '@/components/feedback/SnackbarSuccess';
import SnackbarFailure from '@/components/feedback/SnackbarFailure';
import { mapState } from 'vuex';
export default {
  name: "App",
  components: {
    Navbar,
    FooterWrapper,
    SnackbarSuccess,
    SnackbarFailure
  },
  mixins: [mixinDetectingMobile],
  data: () => ({
    //
  }),
  computed: {
    ...mapState({
      status: state => state.feedback.status
    })
  },
};
</script>
