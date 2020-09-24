<template>
  <div id="app">
    <vue-extend-layouts />
  </div>
</template>

<script>
// import store from '@/store';
import VueExtendLayouts from "vue-extend-layout";
export default {
  name: "App",
  components: { VueExtendLayouts },
  // created () {
  //   this.$store.cache.dispatch("initMarkets");
  //   this.$store.cache.dispatch("initStores");
  // }
};
</script>
