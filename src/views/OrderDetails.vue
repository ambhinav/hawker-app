<template>
  <v-container>
    <v-row justify="center">
      <v-col v-if="!isMobile" cols="12" md="6" lg="6">
        <OrderTable  />
      </v-col>
      <v-col v-else cols="12" md="6" lg="6">
        <OrderTableMobile />
      </v-col>
      <v-col cols="12" md="6" lg="6">
        <CustomerDetails />
      </v-col>
    </v-row>
  </v-container>  
</template>

<script>
import { mixinDetectingMobile } from '@/components/layout/MobileMixin';
import OrderTable from "@/components/OrderTable";
import OrderTableMobile from "@/components/OrderTableMobile";
import CustomerDetails from "@/components/CustomerDetails";
import { mapMutations } from 'vuex';
export default {
  name: "OrderDetails",
  beforeRouteLeave(to, from, next) {
    if (to.name == "Invoice" || to.name == "StoreUser") {
      next();
    } else {
      const answer = window.confirm(
      "Do you really want to leave? You're order won't be saved!"
      );
      if (answer) {
        this.resetCartState();
        next();
      } else {
        next(false);
      }
    }
  },
  components: {
    OrderTable,
    OrderTableMobile,
    CustomerDetails
  },
  mixins: [mixinDetectingMobile],
  methods: {
    ...mapMutations(["resetCartState"])
  }
}
</script>

<style>

</style>