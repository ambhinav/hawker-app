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
										<span style="font-weight: 300">No. of Promos</span>
										<span style="font-weight: 400">{{ getPromos.length }}</span>
									</v-card-title>
								</v-card>
							</v-flex>
						</v-col>
            <v-spacer></v-spacer>
						<v-col cols="4">
							<v-flex xs12>
								<v-card>
									<v-card-title  class="d-flex justify-space-around">
                    Add Promo:
                    <span>
                      <v-btn dark @click="handleAddPromo">
                        add
                      </v-btn>
                    </span>
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
									:items="getPromos"
									class="elevation-1"
								>
                  <template v-slot:item.status="{ item }">
										<v-btn v-if="item.enabled == true" color="green" depressed @click="changePromoStatus(item)">Enabled</v-btn>
										<v-btn v-else color="red" depressed @click="changePromoStatus(item)">Disabled</v-btn>
									</template>
									<template v-slot:item.edit="{ item }">
                    <v-icon @click="handleEditPromo(item)">mdi-pencil</v-icon>
									</template>
									<template v-slot:item.delete="{ item }">
										<v-icon depressed @click="handleRemovePromo(item.id)">mdi-delete</v-icon>
									</template>
								</v-data-table>
							</v-flex>
						</v-col>
					</v-row>
				</v-layout>
			</v-container>
		</v-card>
		<v-dialog v-model="addPromoDialog" persistent max-width="600px">
			<v-card>
				<v-form ref="addPromoForm">
					<v-card-title>
						<span class="headline">Add Promo</span>
					</v-card-title>
					<v-card-text>
						<v-container>
							<v-row justify="center">
								<v-col cols="6">
									<v-text-field
                   type="number"
                   v-model.number="qty"
                   label="Quantity" 
                   required 
                   :rules="getNumberRules"
                   >
                   </v-text-field>
								</v-col>
							</v-row>
							<v-row justify="center">
								<v-col cols="6">
                  <v-text-field
                    v-model="code"
                    label="Code"
                    required
                    :rules="getTextRules"
                  >
                  </v-text-field>
								</v-col>
							</v-row>
              <v-row justify="center">
								<v-col cols="6">
									<v-text-field
                   type="number"
                   v-model.number="discount"
                   label="Discount" 
                   required 
                   :rules="getNumberRules"
                   >
                   </v-text-field>
								</v-col>
							</v-row>
						</v-container>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary darken-1" text @click="handleAddPromoClose()">Close</v-btn>
						<v-btn :loading="loading" color="primary darken-1" text @click="addPromo()">Add</v-btn>
					</v-card-actions>
				</v-form>
			</v-card>
		</v-dialog>
    <v-dialog v-model="editPromoDialog" persistent max-width="600px">
			<v-card>
				<v-form ref="editPromoForm">
					<v-card-title>
						<span class="headline">Edit Promo</span>
					</v-card-title>
					<v-card-text>
						<v-container>
							<v-row justify="center">
								<v-col cols="6">
									<v-text-field
                   type="number"
                   v-model.number="qty"
                   label="Quantity" 
                   required 
                   :rules="getNumberRules"
                   >
                   </v-text-field>
								</v-col>
							</v-row>
							<v-row justify="center">
								<v-col cols="6">
                  <v-text-field
                    v-model="code"
                    label="Code"
                    required
                    :rules="getTextRules"
                  >
                  </v-text-field>
								</v-col>
							</v-row>
              <v-row justify="center">
								<v-col cols="6">
									<v-text-field
                   type="number"
                   v-model.number="discount"
                   label="Discount" 
                   required 
                   :rules="getNumberRules"
                   >
                   </v-text-field>
								</v-col>
							</v-row>
						</v-container>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary darken-1" text @click="handleEditPromoClose()">Close</v-btn>
						<v-btn :loading="loading" color="primary darken-1" text @click="editPromo()">Update</v-btn>
					</v-card-actions>
				</v-form>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import rules from '@/utils/validation';
const { isNumber, required } = rules;
export default {
  name: "Promos",
  created () {
    this.initPromos();
  },
  data () {
    return {
      loading: false,
      addPromoDialog: false,
      editPromoDialog: false,
      promoId: null,
      qty: null,
      code: null,
      discount: null,
      headers: [
				{ 
					text: 'Code', 
					align: 'left', 
					value: 'code' 
				},
				{ 
					text: "Qty", 
					align: 'left', 
					value: 'qty' 
        },
        { 
					text: "Status", 
					align: 'center', 
					value: 'status' 
				},
				{ 
					text: 'Edit', 
					align: 'left', 
					value: 'edit' 
        },
        { 
					text: 'Delete', 
					align: 'left', 
					value: 'delete' 
				},
			],
    }
  },
  computed: {
    ...mapGetters(["getPromos"]),
    getTextRules() {
      return [required];
    },
    getNumberRules() {
      return [isNumber, required];
    },
  },
  methods: {
    ...mapActions([
      "initPromos",
      "createPromo",
      "updatePromo",
      "deletePromo",
      "successToast",
      "errorToast"
    ]),
    handleAddPromo() {
      this.addPromoDialog = true;
    },
    addPromo() {
      if (this.$refs.addPromoForm.validate()) {
        var callAddPromo = async () => {
          try {
            this.loading = true;
            await this.createPromo({
              qty: this.qty,
              code: this.code,
              discount: this.discount
            })
            this.successToast("Created a new promo!");
          } catch (e) {
            console.log(e)
            this.errorToast("Error creating a new promo");
          } finally {
            this.handleAddPromoClose();
          }
        }
        return callAddPromo();
      }
    },
    handleAddPromoClose() {
      this.qty = null;
      this.code = null;
      this.discount = null;
      this.loading = false;
      this.addPromoDialog = false;
      this.$refs.addPromoForm.resetValidation();
    },
    handleEditPromo(promo) {
      this.promoId = promo.id;
      this.qty = promo.qty;
      this.code = promo.code;
      this.discount = promo.discount;
      this.editPromoDialog = true;
    },
    editPromo() {
      if (this.$refs.editPromoForm.validate()) {
        var callUpdatePromo = async () => {
          try {
            this.updatePromo({
              promoId: this.promoId,
              data: {
                qty: this.qty,
                code: this.code,
                discount: this.discount
              }
            })
            this.successToast("Updated promo!");
          } catch (e) {
            console.log(e);
            this.errorToast("Error updating promo");
          } finally {
            this.handleEditPromoClose();
          }
        }
        return callUpdatePromo();
      }
    },
    handleEditPromoClose() {
      this.qty = null;
      this.code = null;
      this.discount = null;
      this.loading = false;
      this.editPromoDialog = false;
      this.$refs.editPromoForm.resetValidation();
    },
    changePromoStatus(promo) {
      var newStatus = !promo.enabled;
      var callUpdatePromo = async () => {
        try {
          this.updatePromo({
            promoId: promo.id,
            data: {
              enabled: newStatus
            }
          })
          this.successToast("Changed status of promo!");
        } catch (e) {
          console.log(e);
          this.errorToast("Error changing status of promo");
        }
      }
      return callUpdatePromo();
    },
    handleRemovePromo(promoId) {
      var callDeletePromo = async () => {
        try {
          await this.deletePromo({ promoId });
          this.successToast("Deleted promo!");
        } catch (e) {
          console.log(e);
          this.errorToast("Error deleting promo");
        }
      }
      return callDeletePromo();
    }
  }
}
</script>

<style>

</style>