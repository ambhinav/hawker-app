<template>
  <div>
    <v-img
        :src="getMarket.image"
        max-height="400"
        class="align-content-end"
      >
        <v-row align="end" class="lightbox green--text pa-2 fill-height">
          <v-col>
            <h1>
              {{ getMarket.name }}
            </h1>
          </v-col>
        </v-row> 
    </v-img>
    <v-container fluid>
      <v-row class="text-center" justify="center">
        <v-col cols="12" class="mb-4">
          <h2 class="font-weight-bold">
            Menu
          </h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col :cols="getStoresInMarket.length === 1 ? 12 : 6" v-for="(store, i) in getStoresInMarket" :key="i">
          <Menu :store="store" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Menu from '@/components/Menu';
import { isSameDay } from '@/utils/dateTimeUtil';
export default {
  name: "StoreUser",
  data () {
    return {
      deliveryDetails: null,
      loading: false,
    }
  },
  mounted () {
    window.addEventListener("beforeunload", this.handlePageReload);
  },
  created () {
    this.loading = true;
    this.deliveryDetails = this.$route.params.deliveryDetails;
    console.log(this.$route.params.deliveryDetails)
  },
  beforeRouteLeave(to, from, next) {
    const answer = window.confirm(
      "Do you really want to leave? you have unsaved changes!"
    );
    if (answer) {
      next();
    } else {
      next(false);
    }
  },
  components: {
    Menu
  },
  computed: {
    ...mapGetters({
      getMarkets: 'getMarkets',
      getStores: 'getStores'
    }),
    getMarket() {
      return this.getMarkets.find(market => market.id === this.deliveryDetails.marketId)
    },
    getStoresInMarket() {
      var allStores = this.getStores.filter(store => {
        return this.getMarket.stores.find(targetStore => targetStore === store.id);
      })
      console.log("All stores", allStores)
      var storesThatMatchCurrentDay = allStores.filter(store => {
        return isSameDay(store.operatingTimes)
      })
      var storesThatAreOperating = storesThatMatchCurrentDay.filter(store => {
        var deliveryTime = store.deliveryTimings.find(timing => timing === this.deliveryDetails.deliveryTime);
        return !!deliveryTime;
      })
      console.log(storesThatAreOperating)
      return storesThatAreOperating;
    }
  },
  methods: {
    handlePageReload() {
      console.log("Here")
    } 
  },
}
</script>

<style>

</style>