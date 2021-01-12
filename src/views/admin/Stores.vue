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
									<template v-slot:item.storeOperatingTimesButton="{ item }">
										<v-btn depressed @click="updateOperatingTimes(item)">edit</v-btn>
									</template>	
                  <template v-slot:item.editImage="{ item }">
                    <v-icon @click="handleEditStoreImage(item)">mdi-pencil</v-icon>
									</template>
									<template v-slot:item.deliverySlotButton="{ item }">
										<v-btn depressed @click="updateDeliverySlots(item)">edit</v-btn>
									</template>
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
		<v-dialog v-model="storeDeliverySlotDialog" persistent max-width="600px">
			<v-card v-if="targetStoreId">
				<v-form ref="updateStoreDeliverySlotsForm">
					<v-card-title>
						<span class="headline">Edit Store Delivery Slots</span>
					</v-card-title>
					<v-card-text>
						<v-container>
							<v-row>
								<v-col cols="12">
									<v-autocomplete
										v-model="storeDeliverySlots"
										:items="getDeliverySlots"
										outlined
										dense
										chips
										small-chips
										label="Delivery Timings"
										multiple
										required
										:rules="deliverySlotRules"
									></v-autocomplete>
								</v-col>
							</v-row>
						</v-container>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="blue darken-1" text @click="handleStoreDeliverySlotClose">Close</v-btn>
						<v-btn :loading="loading" color="blue darken-1" text @click="updateDeliverySlotConfirm">Edit</v-btn>
					</v-card-actions>
				</v-form>
			</v-card>
		</v-dialog>
		<v-dialog v-model="storeOperatingTimesDialog" persistent max-width="600px">
			<v-card v-if="targetStoreId">
				<v-form ref="storeOperatingTimesForm">
					<v-card-title>
						<span class="headline">Edit Store Operating Times</span>
					</v-card-title>
					<v-card-text>
						<v-container>
							<v-row>
								<v-col cols="12">
									<v-autocomplete
										v-model="storeOperatingTimes"
										:items="daysOfWeek"
										outlined
										dense
										chips
										small-chips
										label="Operating Times"
										multiple
										required
										:rules="deliverySlotRules"
									></v-autocomplete>
								</v-col>
							</v-row>
						</v-container>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="blue darken-1" text @click="handleStoreOperatingTimesDialogClose">Close</v-btn>
						<v-btn :loading="loading" color="blue darken-1" text @click="updateStoreOperatingTimesConfirm">Edit</v-btn>
					</v-card-actions>
				</v-form>
			</v-card>
		</v-dialog>
		<v-dialog v-model="editStoreImageDialog" persistent max-width="900px">
			<v-card v-if="targetStoreId">
				<v-card-title>
					<span class="headline">Edit Store {{ targetStoreId }} Image</span>
				</v-card-title>
					<v-row>
						<v-col cols="6">
							<v-img contain height="120" width="200" v-if="fileImgPath" :src="fileImgPath" class="grey lighten-2"></v-img>
						</v-col>
						<v-col cols="6">
							<v-btn  @click="onPickFile()">Pick Store Image</v-btn>
							<input type="file" 
							style="display: none" 
							name="" id="" 
							ref="fileInput" 
							accept="image/*"
							@change="onFilePicked">
						</v-col>
					</v-row>
				<v-card-text>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="blue darken-1" text @click="handleStoreImageDialogClose">Close</v-btn>
					<v-btn :loading="loading" color="blue darken-1" text @click="updateStoreImageConfirm">Edit</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
// import rules from '@/utils/validation';
import { mapGetters, mapActions } from 'vuex';
import rules from '@/utils/validation';
const { isNumber, required } = rules;
import { deliveryTimingsMapping } from '@/utils/deliveryData.js';

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
					text: 'Edit image',
					align: 'left',
          sortable: false,
					value: 'editImage'
				},
				{
					text: 'Edit delivery slots',
					align: 'left',
					value: 'deliverySlotButton',
          sortable: false
				},
				{
					text: 'Edit operating times',
					align: 'left',
					value: 'storeOperatingTimesButton',
          sortable: false
				},
				{ 
					text: 'Add menu item', 
					align: 'left', 
					value: 'menuButton',
          sortable: false
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
			deliverySlotRules: [v => v.length > 0 || "At least one slot required"],
			storeDeliverySlotDialog: false,
			storeDeliverySlots: null,
			storeOperatingTimesDialog: null,
			storeOperatingTimes: null,
			daysOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
			],	
			editStoreImageDialog: false,
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
			return Object.keys(deliveryTimingsMapping);
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
			removeStoreAndMenuItems: "removeStoreAndMenuItems",
			updateStoreDeliverySlots: "updateStoreDeliverySlots",
			updateStoreOperatingTimes: "updateStoreOperatingTimes",
			updateStoreImage: "updateStoreImage"
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
		},
		updateDeliverySlots(store){
			this.targetStoreId = store.id;
			this.storeDeliverySlots = store.deliveryTimings;
			this.storeDeliverySlotDialog = true;
		},
		handleStoreDeliverySlotClose() {
			this.targetStoreId = null;
			this.storeDeliverySlots = null;
			this.storeDeliverySlotDialog = false;
			this.$refs.updateStoreDeliverySlotsForm.resetValidation()	
			this.loading = false;
		},
		updateDeliverySlotConfirm() {
			if (this.$refs.updateStoreDeliverySlotsForm.validate()) {
				this.loading = true;
        const callUpdateStoreDeliverySlots = async () => {
          try {
            await this.updateStoreDeliverySlots({
              deliveryTimings: this.storeDeliverySlots,
							storeId: this.targetStoreId,
            }) 
            this.successToast("Store's delivery slots updated!")
          } catch (e) {
            console.log(e)
            this.errorToast("Error editing store's delivery slots")
          } finally {
            this.handleStoreDeliverySlotClose()
          }
        }
        callUpdateStoreDeliverySlots()
      }	
		},
		updateOperatingTimes(store){
			this.targetStoreId = store.id;
			this.storeOperatingTimes = store.operatingTimes;
			this.storeOperatingTimesDialog = true;
		},
		handleStoreOperatingTimesDialogClose() {
			this.targetStoreId = null;
			this.storeOperatingTimes = null;
			this.storeOperatingTimesDialog = false;
			this.loading = false;
		},
		updateStoreOperatingTimesConfirm() {
			if (this.$refs.storeOperatingTimesForm.validate()) {
				this.loading = true;
        const callUpdateStoreOperatingTimes = async () => {
          try {
            await this.updateStoreOperatingTimes({
              operatingTimes: this.storeOperatingTimes,
							storeId: this.targetStoreId,
						}) 
						console.log("updated")
            this.successToast("Store's operating times updated!")
          } catch (e) {
            console.log(e)
            this.errorToast("Error editing store's operating times")
          } finally {
            this.handleStoreOperatingTimesDialogClose();
          }
        }
        callUpdateStoreOperatingTimes() 
      }	
		},
		handleEditStoreImage(store) {
			this.targetStoreId = store.id
			this.fileImgPath = store.image;
			this.editStoreImageDialog = true;
		},
		handleStoreImageDialogClose() {
			this.loading = false;
			this.targetStoreId = null;
			this.fileImgPath = null;
			this.editStoreImageDialog = false;
		},
		updateStoreImageConfirm() {
			// validate input
			if(!this.file){
				this.errorToast('Please choose a new image to upload!');
				this.handleStoreImageDialogClose();
			}else{
				this.loading = true;
				const callUpdateStoreImage = async () => {
					try {
						await this.updateStoreImage({
							newImage: this.file,
							id: this.targetStoreId
						});
						this.successToast('Store image updated successfully!');
					} catch(err) {
						console.log(err);
						this.errorToast('Error updating store image!');
					} finally {
						this.handleStoreImageDialogClose();
					}
				}
				callUpdateStoreImage();
			}
		}
	}
}
</script>

<style>
</style>