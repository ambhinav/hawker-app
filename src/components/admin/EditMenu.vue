<template>
  <div>
    <v-card height="100vh">
			<v-container grid-list-md>
				<v-layout row wrap>
					<v-row no-gutters>
            <v-col cols="2">
							<v-flex xs12>
								<v-card @click="goBack()">
                  <v-card-title  class="d-flex justify-space-between">
                    <v-icon>mdi-arrow-left-thick</v-icon>
                    <span style="font-weight: 300"><b>GO BACK</b></span>
                  </v-card-title>
                </v-card>
							</v-flex>
						</v-col>
            <v-spacer></v-spacer>
						<v-col cols="4">
							<v-flex xs12>
								<v-card>
									<v-card-title  class="d-flex justify-center">
										<span style="font-weight: 300">Menu for store <b>{{ storeId }}</b></span>
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
									:items="getSelectedMenu"
									class="elevation-1"
								>
									<template v-slot:item.slots="{ item }">
                    <div v-for="(slot, i) in item.deliverySlots" :key="i">
                      {{ slot }}
                    </div>
									</template>
                  <template v-slot:item.edit="{ item }">
                    <v-icon @click="handleEditMenuItem(item)">mdi-pencil</v-icon>
									</template>
                  <template v-slot:item.delete="{ item }">
                    <v-icon @click="deleteItem(item.id)">mdi-delete</v-icon>
									</template>
                  <template v-slot:item.addNm="{ item }">
                    <v-btn @click="addNm(item.id)">add</v-btn>
									</template>
								</v-data-table>
							</v-flex>
						</v-col>
					</v-row>
				</v-layout>
			</v-container>
		</v-card>
		<v-dialog v-model="menuItemDialog" persistent max-width="600px">
			<v-card>
				<v-form ref="editMenuItemForm">
					<v-card-title>
						<span class="headline">Edit Menu Item</span>
					</v-card-title>
					<v-card-text>
						<v-container>
							<v-row>
								<v-col cols="12">
									<v-text-field v-model="itemName" label="Name" required :rules="getTextRules"></v-text-field>
								</v-col>
							</v-row>
							<v-row>
                <v-col cols="6">
									<v-autocomplete
                    chips
                    small-chips
                    label="Delivery Slots"
                    :items="getDeliverySlots"
                    v-model="itemDeliverySlots"
                    :rules="deliverySlotRules"
										multiple
                  >
                  </v-autocomplete>
								</v-col>
								<v-col cols="6">
									<v-text-field type="number" v-model.number="itemPrice" label="Price" required :rules="getNumberRules"></v-text-field>
								</v-col>
							</v-row>
							<!-- <v-row>
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
							</v-row> -->
						</v-container>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary darken-1" @click="handleMenuFormClose">Close</v-btn>
						<v-btn :loading="loading" color="primary darken-1" @click="editMenuItemConfirm">Update</v-btn>
					</v-card-actions>
				</v-form>
			</v-card>
		</v-dialog>
    <v-dialog v-model="addNmDialog" max-width="600px">
      <v-card>
        <v-card-title>
          Add NM
        </v-card-title>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field type="number" v-model.number="nm" label="NM" required :rules="getNumberRules"></v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :loading="loading" color="primary darken-1" @click="confirmAddNm">add</v-btn>
        </v-card-actions>
      </v-card>
      
    </v-dialog>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import rules from '@/utils/validation';
const { isNumber, required } = rules;
export default {
  name: "EditMenu",
  created () {
    this.storeId = this.$route.params.id;
  },
  data () {
    return {
      storeId: null,
      headers: [
        {
          text: "Name",
          align: "left",
          value: "name"
        },
        {
          text: "Price (AM)",
          align: "left",
          value: "price"
        },
        {
          text: "Price (NM)",
          align: "left",
          value: "nm"
        },
        {
          text: "Slots",
          align: "left",
          value: "slots"
        },
        {
          text: "Edit",
          align: "left",
          value: "edit"
        },
        {
          text: "Delete",
          align: "left",
          value: "delete"
        },
        {
          text: "Add NM",
          align: "left",
          value: "addNm"
        },
      ],
      deliverySlotRules: [v => v.length > 0 || "At least one slot required"],
      menuItemDialog: false,
      itemDeliverySlots: null,
      itemName: null,
      itemPrice: null,
      itemId: null,
      nm: null,
      addNmDialog: false
    }
  },
  computed: {
    ...mapGetters(['getMenu', 'getStores']),
    getSelectedMenu() {
      var targetStore = this.getStores.find(store => store.id == this.storeId);
      var selectedMenu = this.getMenu.filter(menuItem => targetStore.menu.includes(menuItem.id));
      return selectedMenu;
    },
    getStore() {
      return this.getStores.find(store => store.id == this.storeId);
    },
    getDeliverySlots() {
      return this.getStore.deliveryTimings;
    },
    getNumberRules() {
      return [isNumber, required];
    },
    getTextRules() {
      return [required];
		},
  },
  methods: {
    ...mapActions({
      editMenuItem: "editMenuItem",
      successToast: "successToast",
      errorToast: "errorToast",
      deleteMenuItem: "deleteMenuItem",
      addNonMarkup: "addNonMarkup" 
    }),
    goBack() {
      this.$router.push("/admin/stores");
    },
    deleteItem(itemId) {
      const callDelete = async () => {
        try {
          this.loading = true;
          await this.deleteMenuItem({
            itemId,
            storeId: this.storeId
          });
          this.loading = false;
          this.successToast("Item deleted from menu!");
        } catch (e) {
          this.loading = false;
          this.errorToast("Error removing item from menu");
          console.log(e);
        }
      }
      callDelete();
    },
    handleMenuFormClose() {
      this.itemName = null;
      this.itemPrice = null;
      this.itemDeliverySlots = null;
      this.loading = false;
      this.menuItemDialog = false;
      this.itemId = null;
			this.$refs.editMenuItemForm.resetValidation();
    },
    handleEditMenuItem(item) {
      this.itemName = item.name;
      this.itemPrice = item.price;
      this.itemDeliverySlots = item.deliverySlots;
      this.itemId = item.id;
      this.menuItemDialog = true;
    },
    editMenuItemConfirm() {
      if (this.$refs.editMenuItemForm.validate()) {
				this.loading = true;
        const callEditMenuItem = async () => {
          try {
            await this.editMenuItem({
              name: this.itemName,
              deliverySlots: this.itemDeliverySlots,
              price: this.itemPrice,
              id: this.itemId
            }) 
            this.successToast("Menu item updated!")
          } catch (e) {
            console.log(e)
            this.errorToast("Error updating menu item")
          } finally {
            this.handleMenuFormClose()
          }
        }
        callEditMenuItem()
      }
    },
    addNm(itemId) {
      this.itemId = itemId;
      this.addNmDialog = true;
    },
    confirmAddNm() {
      var callAddNm = async () => {
        try {
          this.loading = true;
          await this.addNonMarkup({
            id: this.itemId,
            nm: this.nm
          });
          this.successToast("Menu item nm added!");
        } catch (err) {
          console.log(err);
          this.errorToast("Error updating menu item")
        } finally {
          this.handleNmFormClose()
        }
      }
      return callAddNm()
    },
    handleNmFormClose() {
      this.loading = false;
      this.itemId = null;
      this.addNmDialog = false;
      this.nm = null;
    }
  }
}
</script>

<style>

</style>