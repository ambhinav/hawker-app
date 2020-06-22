<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <OrderTable />
      </v-col>
      <v-divider vertical inset class="hidden-sm-and-down"></v-divider>
      <v-col cols="12" md="6">
        Penis
      </v-col>
    </v-row>
  </v-container>  
</template>

<script>
import OrderTable from "@/components/OrderTable";
export default {
  name: "OrderDetails",
  components: {
    OrderTable
  }
}
</script>

<style>

</style>