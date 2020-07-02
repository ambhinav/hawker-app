<template>
  <div>
    <v-card height="100vh">
      <v-container grid-list-md>
        <v-layout row wrap>
          <v-row no-gutters>
            <v-col cols="4">
              <v-flex xs12>
                <v-card>
                  <v-card-title  class="d-flex justify-space-between">
                    <span style="font-weight: 300">No. of Orders</span>
                    <span style="font-weight: 400">{{ getSelectedOrders.length }}</span>
                  </v-card-title>
                </v-card>
              </v-flex>
            </v-col>
            <v-col cols="8">
              <v-flex xs12>
                <v-card>
                  <v-card-title  class="d-flex justify-space-around">
                    <v-btn v-if="targetMarket" @click="showAllMarkets">ALL</v-btn>
                    <span style="font-weight: 300">Market:</span>
                      <v-menu offset-y>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          dark
                          v-on="on"
                        >
                          {{ marketListButtonDisplay }}
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item
                          v-for="(market, index) in getMarkets"
                          :key="index"
                          @click="onMarketSelect(market)"
                        >
                          <v-list-item-title>{{ market.name }}</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-card-title>
                </v-card>
              </v-flex>
            </v-col>
          </v-row>
        </v-layout>
        <v-layout column class="mt-5">
          <v-row justify="center">
            <v-col cols="8">
              <v-text-field
              outlined
              v-model="search"
              append-icon="mdi-search"
              label="Search for an order (Payment method or number)"
              single-line
              hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row >
            <v-col cols="12">
              <v-flex xs12>
                <v-data-table
                  :headers="headers"
                  :items="getSelectedOrders"
                  :search="search"
                  class="elevation-1"
                >
                  <template v-slot:item.created_at="{ item }">
                    {{ formatTimeStamp(item.created_at) }}
                  </template>
                  <template v-slot:item.menu="{ item }">
                    <v-btn depressed @click="handleShowMenuDetails(item)">show</v-btn>
                  </template>
                  <template v-slot:item.status="{ item }">
                    <v-btn depressed width="50" color="primary" v-if="item.orderStatus == 'paid'" @click="handleChangeOrderStatus(item)">paid</v-btn>
                    <v-btn depressed color="yellow" v-if="item.orderStatus == 'pending'" @click="handleChangeOrderStatus(item)">pending</v-btn>
                    <v-btn depressed color="error" v-if="item.orderStatus == 'cancelled'" @click="handleChangeOrderStatus(item)">cancelled</v-btn>
                    
                  </template>
                  <template v-slot:item.customerDetails="{ item }">
                    <v-btn depressed @click="handleShowCustomerDetails(item)">show</v-btn>
                  </template>
                </v-data-table>
              </v-flex>
            </v-col>
          </v-row>
        </v-layout>
      </v-container>
    </v-card>
    <v-dialog v-model="orderStatusDialog" persistent max-width="400">
      <v-card>
        <v-card-title>
          Change order status
        </v-card-title>
        <v-card-text>
          <v-select
            :items="orderStates"
            label="Order Status"
            outlined
            v-model="selectedOrderStatus"
            ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="onOrderStatusChanged">close</v-btn>
          <v-btn
            color="primary"
            text
            @click="changeOrderStatus()"
            :loading="loading"
          >
            change
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="menuItemDialog" persistent max-width="400">
      <v-card>
        <v-card-title>
          Cart details
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row justify="center">
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">Name</th>
                      <th class="text-left">Quantity</th>
                      <th class="text-left">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in getNewCart" :key="item.name">
                      <td>{{ item.name }}</td>
                      <td>{{ item.name == "Delivery Cost" || item.name == "Total Cost" ? "" : item.qty }}</td>
                      <td>{{ item.price }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="onMenuItemDialogClose">close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="customerDialog" persistent max-width="400">
      <v-card v-if="targetOrder">
        <v-card-title>
          Customer details
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item>
              Name: {{ targetOrder.customerName }}
            </v-list-item>
            <v-list-item>
              Contact: {{ targetOrder.customerNumber }}
            </v-list-item>
          </v-list>  
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="onCustomerDialogClose">close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// import rules from '@/utils/validation';
import { mapGetters, mapActions } from 'vuex';
import rules from '@/utils/validation';
import { formatTimeAndDate } from '@/utils/dateTimeUtil';
const { required } = rules;

export default {
  name: 'Orders',
  created() {
    this.initOrders();
  },
	data () {
		return {
      targetMarket: null,
      search: "",
			headers: [
				{ 
					text: 'Number', 
					align: 'left', 
					value: 'orderNumber' 
        },
        { 
					text: 'Date/Time Placed', 
					align: 'left', 
					value: 'created_at' 
				},
				{ 
					text: 'Payment Method', 
					align: 'left', 
					value: 'paymentMethod' 
				},
				{
					text: "Customer Details",
					align: 'left',
					value: 'customerDetails',
          sortable: false,
          filterable: false
        },
        {
          text: "Items Ordered",
          align: "left",
          value: "menu",
          sortable: false,
          filterable: false
        },
        {
					text: 'Status',
					align: 'left',
          value: 'status',
          sortable: false,
          filterable: false
				},
      ],
      orderStates: [
        "pending",
        "cancelled",
        "paid"
      ],
      orderStatusDialog: false,
      menuItemDialog: false,
      customerDialog: false,
			loading: false,
    }
	},
	computed: {
		...mapGetters({
      getMarkets: "getMarkets",
      getOrders: "getOrders"
    }),
    marketListButtonDisplay() {
      if (!this.targetMarket) {
        return "ALL"
      }
      return this.targetMarket.name;
    },
    getTextRules() {
      return [required];
		},
		// getDeliverySlots() {
		// 	return deliverySlots;
    // }
    getSelectedOrders() {
      if (!this.targetMarket) {
        return this.getOrders;
      }
      return this.getOrders.filter(order => order.marketId == this.targetMarket.id);
    },
    getNewCart() {
      var copy = JSON.parse(JSON.stringify(this.targetOrder.cart));
      copy.push({ name: "Delivery Cost", price: this.targetOrder.deliveryCost }, { name: "Total Cost", price: this.targetOrder.totalCost })
      return copy
    },
	},
	methods: {
		...mapActions({
      initOrders: "initOrders",
      toggleOrderStatus: "toggleOrderStatus",
      successToast: "successToast",
      errorToast: "errorToast" 
    }),
    formatTimeStamp(timestamp) {
      return formatTimeAndDate(timestamp);
    },
    onMarketSelect(market) {
      this.targetMarket = market;
    },
    showAllMarkets() {
      this.targetMarket = null;
    },
    handleChangeOrderStatus(order) {
      this.selectedOrderStatus = order.orderStatus;
      this.targetOrder = order;
      this.orderStatusDialog = true;
    },
    changeOrderStatus() {
      this.loading = true;
      this.toggleOrderStatus({
        newStatus: this.selectedOrderStatus,
        orderId: this.targetOrder.id 
      })
      .then(() => this.successToast("Order status updated!"))
      .catch(() => this.errorToast("Error updating order status"))
      .finally(() => this.onOrderStatusChanged());
    },
    onOrderStatusChanged() {
      this.selectedOrderStatus = null;
      this.targetOrder = null;
      this.orderStatusDialog = false;
      this.loading = false;
    },
    handleShowMenuDetails(order) {
      this.targetOrder = order;
      this.menuItemDialog = true;
    },
    onMenuItemDialogClose() {
      this.targetOrder = null;
      this.menuItemDialog = false;
    },
    onCustomerDialogClose() {
      this.customerDialog = false;
      this.targetOrder = null;
    },
    handleShowCustomerDetails(order) {
      this.targetOrder = order;
      this.customerDialog = true;
    }
	}
}
</script>

<style>

</style>