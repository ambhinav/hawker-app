<template>
	<div>
		<v-card height="100vh">
			<v-container grid-list-md>
				<v-layout row wrap>
					<v-row no-gutters>
						<v-col cols="8">
							<v-flex xs12>
								<v-card>
									<v-card-title  class="d-flex justify-space-between">
										<span style="font-weight: 300">No. of Stores</span>
										<span style="font-weight: 400">{{ getSelectedStores.length }}</span>
									</v-card-title>
								</v-card>
							</v-flex>
						</v-col>
						<v-col cols="4">
							<v-flex xs12>
								<v-card>
									<v-card-title  class="d-flex justify-space-between">
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
													v-for="(market, index) in getProcessedMarkets"
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
				<v-layout row wrap class="mt-5">
					<v-row no-gutters>
						<v-col cols="12">
							<v-flex xs12>
								<v-data-table
									:headers="headers"
									:items="getSelectedStores"
									class="elevation-1"
								>
									<template v-slot:item.menuButton="{ item }">
										<v-btn depressed @click="addMenuItem(item.id)">add</v-btn>
									</template>
                  <template v-slot:item.enabled="{ item }">
										<v-btn v-if="item.enabled == true" color="green" depressed @click="changeStoreStatus(item)">Enabled</v-btn>
										<v-btn v-else color="red" depressed @click="changeStoreStatus(item)">Disabled</v-btn>
									</template>
								</v-data-table>
							</v-flex>
						</v-col>
					</v-row>
				</v-layout>
			</v-container>
		</v-card>
		<v-dialog v-model="modifyInventoryDialog" persistent max-width="600px">
			<v-card>
				<v-form ref="modifyInventoryForm">
					<v-card-title>
						<span class="headline">Modify Inventory</span>
					</v-card-title>
					<v-card-text>
						<v-container>
							<v-row>
								<v-col cols="12" sm="6">
									<v-text-field v-model="storeQty" label="Store Qty" required :rules="getIntRules"></v-text-field>
								</v-col>
								<v-col cols="12" sm="6">
									<v-text-field v-model="warehouseQty" label="Warehouse Qty" required :rules="getIntRules"></v-text-field>
								</v-col>
							</v-row>
							<v-row>
								<v-col cols="12" sm="6">
									<v-text-field v-model="soldQty" label="Sold Qty" required :rules="getIntRules"></v-text-field>
								</v-col>
							</v-row>
							<v-row>
								<v-col cols="12" sm="9">
									<v-text-field v-model="totalQty" label="Total Qty" required :rules="qtyRule"></v-text-field>
								</v-col>
							</v-row>
						</v-container>
						<v-row>
							<v-col cols="12">
								<span v-if="feedback" class="headline red--text"> {{ feedback }} </span>
							</v-col>
						</v-row>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="blue darken-1" text @click="handleInventoryUpdateClose">Close</v-btn>
						<v-btn :loading="loading" color="blue darken-1" text @click="modifyInventoryConfirm">Update</v-btn>
					</v-card-actions>
				</v-form>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
// import rules from '@/utils/validation';
import { mapGetters, mapActions } from 'vuex';

export default {
	name: 'Stores',
	data () {
		return {
      targetMarket: null,
			headers: [
				{ 
					text: 'ID', 
					align: 'left', 
					value: 'id' 
				},
				{ 
					text: 'Name', 
					align: 'left', 
					value: 'name' 
				},
				{ 
					text: 'Add menu item', 
					align: 'left', 
					value: 'menuButton' 
				},
				{
					text: 'Status',
					align: 'left',
          value: 'enabled',
          sortable: false
				},
			],
		}
	},
	computed: {
		...mapGetters({
			getMarkets: "getMarkets",
      getStores: "getStores",
    }),
    getSelectedStores() {
      if (!this.targetMarket) {
        return this.getStores;
      } else if (!Object.prototype.hasOwnProperty.call(this.targetMarket, "stores")){
        return [];
      }
      return this.getStores.filter(store => {
        return this.targetMarket.stores.find(attachedStoreId =>  attachedStoreId === store.id);
      })
    },
    getProcessedMarkets() {
      let filteredMarkets = Array.from(this.getMarkets)
      if (this.targetMarket) {
        filteredMarkets = this.getMarkets.filter(market => market.id !== this.targetMarket.id)
      }
      return filteredMarkets.push({ name: "ALL", id: "x" });
    },
    marketListButtonDisplay() {
      if (!this.targetMarket) {
        return "ALL"
      }
      return this.targetMarket.name;
    }
	},
	methods: {
		...mapActions({
      addMenuItemToStore: "addMenuItemToStore",
      toggleStoreStatus: "toggleStoreStatus",
      successToast: "successToast",
      errorToast: "errorToast" 
    }),
    onMarketSelect(market) {
      this.targetMarket = market;
    },
    changeStoreStatus(store) {
      var newStatus = !store.enabled
      this.toggleStoreStatus({ id: store.id, newStatus })
      .then(() => this.successToast("Store status updated!"))
      .catch(() => this.errorToast("Error updating store status"));
    }
	}

}
</script>

<style>

</style>