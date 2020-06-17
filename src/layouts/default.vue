<template>
  <v-app>
    <Navbar />
    <v-main>
      <router-view />
    </v-main>
    <Footer />
  </v-app>
</template>

<script>
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { mixinDetectingMobile } from "@/components/layout/MobileMixin.js";
export default {
  name: "App",
  components: {
    Navbar,
    Footer
  },
  mixins: [mixinDetectingMobile],
  data: () => ({
    //
  })
};
</script>
