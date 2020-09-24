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
										<span style="font-weight: 300">No. of Stores</span>
										<span style="font-weight: 400">{{ getSelectedStores.length }}</span>
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
									<template v-slot:item.editMenu="{ item }">
										<v-btn depressed @click="editMenu(item.id)">edit</v-btn>
									</template>
									<template v-slot:item.delete="{ item }">
										<v-icon depressed @click="removeStore(item)">mdi-delete</v-icon>
									</template>
								</v-data-table>
							</v-flex>
						</v-col>
					</v-row>
				</v-layout>
			</v-container>
		</v-card>
		<v-dialog v-model="menuItemDialog" persistent max-width="600px">
			<v-card v-if="targetStoreId">
				<v-form ref="addMenuItemForm">
					<v-card-title>
						<span class="headline">Add Menu Item</span>
					</v-card-title>
					<v-card-text>
						<v-container>
							<v-row>
								<v-col cols="6">
									<v-text-field v-model="itemName" label="Name" required :rules="getTextRules"></v-text-field>
								</v-col>
								<v-col cols="6">
              		<v-text-field type="number" v-model.number="nm" label="Price (NM)" required :rules="getNumberRules"></v-text-field>
								</v-col>
							</v-row>
							<v-row>
                <v-col cols="6">
									<v-autocomplete
                    label="Delivery Slots"
                    :items="getStoreDeliverySlots"
                    v-model="itemDeliverySlots"
                    :rules="deliverySlotRules"
										multiple
                  >
                  </v-autocomplete>
								</v-col>
								<v-col cols="6">
									<v-text-field type="number" v-model.number="itemPrice" label="Price (AM)" required :rules="getNumberRules"></v-text-field>
								</v-col>
							</v-row>
							<v-row>
                <v-col cols="6">
                  <v-img contain height="120" width="120" v-if="fileImgPath" :src="fileImgPath" class="grey lighten-2"></v-img>
                </v-col>
								<v-col cols="6">
                  <v-btn  @click="onPickFile()">Pick Item Image</v-btn>
                  <input type="file" 
                  style="display: none" 
                  name="" id="" 
                  ref="fileInput" 
                  accept="image/*"
                  @change="onFilePicked">
								</v-col>
							</v-row>
						</v-container>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="blue darken-1" text @click="handleMenuFormClose">Close</v-btn>
						<v-btn :loading="loading" color="blue darken-1" text @click="addMenuItemConfirm">Add</v-btn>
					</v-card-actions>
				</v-form>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
// import rules from '@/utils/validation';
import { mapGetters, mapActions } from 'vuex';
import rules from '@/utils/validation';
const { isNumber, required } = rules;
import { deliverySlots } from '@/utils/deliveryData.js';

export default {
	name: 'Stores',
	created() {
		this.$store.cache.dispatch("initStores");
	},
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
				{
					text: "Edit Menu",
					align: 'left',
					value: 'editMenu',
					sortable: false
				},
				{
					text: "Delete",
					align: "left",
					value: "delete",
					sortable: false
				}
			],
      menuItemDialog: false,
      targetStoreId: null,
      itemDeliverySlots: null,
      itemName: null,
			itemPrice: null,
			nm: null, // price (nm)
      fileImgPath: null,
			loading: false,
			deliverySlotRules: [v => v.length > 0 || "At least one slot required"]
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
    marketListButtonDisplay() {
      if (!this.targetMarket) {
        return "ALL"
      }
      return this.targetMarket.name;
    },
    getNumberRules() {
      return [isNumber, required];
    },
    getTextRules() {
      return [required];
		},
		getDeliverySlots() {
			return deliverySlots;
		},
		getStoreDeliverySlots() {
			var targetStore = this.getStores.find(store => store.id == this.targetStoreId);
			return targetStore.deliveryTimings;
		}
	},
	methods: {
		...mapActions({
      addMenuItemToStore: "addMenuItemToStore",
      toggleStoreStatus: "toggleStoreStatus",
      successToast: "successToast",
			errorToast: "errorToast",
			removeStoreAndMenuItems: "removeStoreAndMenuItems"
    }),
    onMarketSelect(market) {
      this.targetMarket = market;
    },
    showAllMarkets() {
      this.targetMarket = null;
    },
    changeStoreStatus(store) {
      var newStatus = !store.enabled
      this.toggleStoreStatus({ id: store.id, newStatus })
      .then(() => this.successToast("Store status updated!"))
      .catch(() => this.errorToast("Error updating store status"));
    },
    addMenuItem(storeId) {
      this.targetStoreId = storeId;
      this.menuItemDialog = true;
    },
    onPickFile() {
			this.$refs.fileInput.click()
		},
    onFilePicked(event) {
			this.file = event.target.files[0];
			var reader = new FileReader();
			reader.onload = (e) => {
				this.fileImgPath = e.target.result;
			}
			reader.readAsDataURL(this.file);
    },
    handleMenuFormClose() {
      this.itemName = null;
      this.itemPrice = null;
      this.itemDeliverySlots = null;
      this.fileImgPath = null;
      this.loading = false;
      this.targetStoreId = null;
      this.menuItemDialog = false;
			this.$refs.addMenuItemForm.resetValidation();
			this.file = null;
			this.nm = null;
    },
    addMenuItemConfirm() {
      if (this.$refs.addMenuItemForm.validate()) {
				this.loading = true;
        const callAddMenuItem = async () => {
          try {
            await this.addMenuItemToStore({
              name: this.itemName,
              deliverySlots: this.itemDeliverySlots,
              price: this.itemPrice,
              image: this.file, // optional
							storeId: this.targetStoreId,
							nm: this.nm
            }) 
            this.successToast("Item added to store's menu!")
          } catch (e) {
            console.log(e)
            this.errorToast("Error adding item to store's menu")
          } finally {
            this.handleMenuFormClose()
          }
        }
        callAddMenuItem()
      }
		},
		editMenu(storeId) {
			this.$router.push({ name: "EditMenu", params: { id: storeId } });
		},
		removeStore(store) {
			var callRemoveStore = async () => {
				try {
					var targetMarket = this.getMarkets.find(market => {
						if (market.stores) {
							return market.stores.includes(store.id);
						}
					});
					await this.removeStoreAndMenuItems({ store, marketId: targetMarket.id });
					this.successToast("Store deleted!")
				} catch (e) {
					console.log(e);
					this.errorToast("Error deleting store")
				}
			}
			return callRemoveStore();
		}
	}
}
</script>

<style>
</style>