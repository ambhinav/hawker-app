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
export default {
  name: "OrderDetails",
  components: {
    OrderTable,
    OrderTableMobile,
    CustomerDetails
  },
  mixins: [mixinDetectingMobile],
}
</script>

<style>

</style>