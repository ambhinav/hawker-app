<template>
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
                  <template v-slot:item.delete="{ item }">
                    <v-icon @click="deleteMenuItem(item.id)">mdi-delete</v-icon>
									</template>
								</v-data-table>
							</v-flex>
						</v-col>
					</v-row>
				</v-layout>
			</v-container>
		</v-card>
		<!-- <v-dialog v-model="menuItemDialog" persistent max-width="600px">
			<v-card>
				<v-form ref="addMenuItemForm">
					<v-card-title>
						<span class="headline">Add Menu Item</span>
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
		</v-dialog> -->
	<!-- </div> -->
</template>

<script>
import { mapGetters } from 'vuex';
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
          text: "Price",
          align: "left",
          value: "price"
        },
        {
          text: "Slots",
          align: "left",
          value: "slots"
        },
        {
          text: "Delete",
          align: "left",
          value: "delete"
        },
      ]
    }
  },
  computed: {
    ...mapGetters(['getMenu', 'getStores']),
    getSelectedMenu() {
      var targetStore = this.getStores.find(store => store.id == this.storeId);
      var selectedMenu = this.getMenu.filter(menuItem => targetStore.menu.includes(menuItem.id));
      return selectedMenu;
    }
  },
  methods: {
   goBack() {
     this.$router.push("/admin/stores");
   },
   deleteMenuItem(itemId) {
     console.log(itemId);
   } 
  }
}
</script>

<style>

</style>