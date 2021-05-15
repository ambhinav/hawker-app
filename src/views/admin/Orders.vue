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
                  <template v-slot:item.milkRunJobCreateBtn="{ item }">
                    <v-btn depressed @click="openMilkRunCreateJobDialog(item)" color="success">create</v-btn>
                  </template>
                  <template v-slot:item.milkRunJobCancelBtn="{ item }">
                    <v-btn depressed @click="cancelMilkRunJob(item)" color="error">cancel</v-btn>
                  </template>
                  <template v-slot:item.status="{ item }">
                    <v-btn depressed width="50" color="green" v-if="item.orderStatus == 'paid'" @click="handleChangeOrderStatus(item)">paid</v-btn>
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
    <v-dialog v-model="menuItemDialog" persistent max-width="600">
      <v-card v-if="targetOrder">
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
                      <th class="text-left">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in targetOrder.cart" :key="i">
                      <td>{{ item.name }}</td>
                      <td>
                          <v-btn v-if="item.qty > 1" x-small fab color="primary" @click="updateQty(item, -1)">
                            <v-icon dark>mdi-minus</v-icon>
                          </v-btn> 
                          <v-btn text>
                            <span>{{ item.qty }}</span>
                          </v-btn>
                          <v-btn x-small fab color="primary" @click="updateQty(item, 1)">
                            <v-icon dark>mdi-plus</v-icon>
                          </v-btn>
                      </td>
                      <td>{{ item.price }}</td>
                      <td>
                        <v-icon
                          small
                          @click="deleteItem(item)"
                        >
                          mdi-delete
                        </v-icon>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-row>
            <v-row>
              <v-col cols="12">
                Delivery cost: {{ targetOrder.deliveryCost }}
              </v-col>
              <v-col cols="12">
                Total cost:    {{ targetOrder.totalCost }}
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="onMenuItemDialogClose">close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
          <v-btn :loading="loading" color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
          <v-spacer></v-spacer>
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
    <v-dialog v-model="showMilkRunJobCreateDialog" max-width="300">
      <v-card v-if="targetOrder">
        <v-card-title>
          Create Milk Run Delivery Job
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item>
              <v-btn @click="submitMROrderNow">submit now</v-btn>
            </v-list-item>
            <v-list-item>
              <v-btn @click="scheduleMROrder">schedule delivery</v-btn>
            </v-list-item>
          </v-list>  
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import rules from '@/utils/validation';
import { formatTimeAndDate } from '@/utils/dateTimeUtil';
const { required } = rules;

export default {
  name: 'Orders',
  created() {
    this.$store.cache.dispatch("initOrders");
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
					text: 'ID (Use with MR Dashboard)', 
					align: 'left', 
					value: 'id' 
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
          text: "Submit MR Job",
          align: "left",
          value: "milkRunJobCreateBtn",
          sortable: false,
          filterable: false,
        },
        {
          text: "Cancel MR Job",
          align: "left",
          value: "milkRunJobCancelBtn",
          sortable: false,
          filterable: false,
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
      itemToDelete: null,
      dialogDelete: false,
      targetOrder: null,
      showMilkRunJobCreateDialog: false
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
    
	},
	methods: {
		...mapActions([
      "toggleOrderStatus",
      "successToast",
      "errorToast",
      "removeItemFromOrder",
      "updateItemQtyInOrder",
      "createMilkRunDeliveryJob",
      "cancelMilkRunDeliveryJob"
    ]),
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
    },
    deleteItem(item) {
      this.itemToDelete = item;
      this.dialogDelete = true;
    },
    closeDelete() {
      this.itemToDelete = null;
      this.dialogDelete = false;
    },
    deleteItemConfirm() {
      this.loading = true;
      const callDeleteItem = async () => {
        try {
          await this.removeItemFromOrder({
            order: this.targetOrder,
            item: this.itemToDelete
          });
          this.successToast("Item removed from Order!");
        } catch (err) {
          this.errorToast("Error removing item from Order!");
        } finally {
          this.closeDelete();
          this.loading = false;
          this.menuItemDialog = false;
        }
      }
      callDeleteItem();
    },
    updateQty(item, value) {
      const oldQty = item.qty;
      const newItem = {
        ...item,
        qty: oldQty + value
      }
      const callUpdateItemQty = async () => {
        try {
          await this.updateItemQtyInOrder({
            order: this.targetOrder,
            item: newItem,
            oldQty
          })
          this.successToast("Item quantity updated!");
        } catch (err) {
          this.errorToast("Error updating item in Order!");
        } finally {
          this.onMenuItemDialogClose();
        }
      }
      callUpdateItemQty();
    },
    isMilkRunJob(order) {
      if (Object.prototype.hasOwnProperty.call(order, "isMilkRunJob")) {
        return order.isMilkRunJob;
      } else {
        return false;
      }
    },
    openMilkRunCreateJobDialog(order) {
      this.showMilkRunJobCreateDialog = true;
      this.targetOrder = order;
    },
    submitMROrderNow() {
      return this.createMilkRunJob(this.targetOrder, false);
    },
    scheduleMROrder() {
      return this.createMilkRunJob(this.targetOrder, true);
    },
    createMilkRunJob(order, isScheduled) {
      // validate that it is not already a milkrun job and order is paid
      if (!this.isMilkRunJob(order) && order.orderStatus == "paid") {
        const callCreateMilkRunJob = async () => {
          try {
            await this.createMilkRunDeliveryJob({
              order,
              isScheduled
            });
            this.successToast("Milk Run Job Created!");
          } catch (error) {
            this.errorToast(error);
          } finally {
            this.handleCreateMilkRunJobDialogClose();
          }
        }
        callCreateMilkRunJob();
      } else {
        this.errorToast("Order has already been dispatched to Milk Run Server OR has not been paid!");
      }
    },
    handleCreateMilkRunJobDialogClose() {
      this.showMilkRunJobCreateDialog = false;
      this.targetOrder = null;
    },
    cancelMilkRunJob(order) {
      if (this.isMilkRunJob(order)) {
        const callCancelMilkRunJob = async () => {
          try {
            await this.cancelMilkRunDeliveryJob({
              deliveryId: order.id
            });
            this.successToast("Milk Run Job Cancelled!");
          } catch (error) {
            this.errorToast(error);
          }
        }
        callCancelMilkRunJob();
      } else {
        this.errorToast("Error cancelling, not a Milk Run Job!");
      }
    }
	}
}
</script>

<style>

</style>