<template>
  <div>
    <v-card
      class="mx-auto"
      max-width="600"
      :disabled="!store.enabled"
    >
      <v-img
        :src="store.image"
        lazy-src="https://images.unsplash.com/photo-1557682260-96773eb01377"
        height="200px"
        @click="toggleMenu"
      ></v-img>

      <v-card-title>
        {{ store.name }}
      </v-card-title>
      <v-card-subtitle>
        <b>Operating days</b>: {{ formatInfo(store.operatingTimes) }}
        <br>
        <b>Operating delivery slots</b>: {{ formatInfo(store.deliveryTimings) }}
        <br>
        <div class="error--text">Minimum order is $4.</div>
      </v-card-subtitle>
      <v-card-text v-if="!store.enabled" class="red--text">
        Sorry, this store is unavailable for the slot you chose.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          v-if="store.enabled"
          icon
          @click="toggleMenu"
          text
          class="pr-12 primary--text"
        >
          {{ show ? 'hide menu' : 'show menu' }}
        </v-btn>
      </v-card-actions>

      <v-expand-transition v-if="store.menu && show">
        <div v-show="show">
          <v-divider></v-divider>
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <p>
                  Menu
                </p>
                <v-list class="transparent">
                  <v-list-item
                    v-for="(item, i) in getMenuItems"
                    :key="i"
                  >
                    <v-row
                      align="center"
                      no-gutters
                    >
                      <v-col
                        v-if="item.image"
                        :cols="imageBp.image"
                      >
                        <v-avatar
                        size="40px"
                        rounded
                        >
                          <img
                            :src="item.image"
                          >
                        </v-avatar>
                      </v-col>
                      <v-col
                        :cols="item.image ? imageBp.name : noImageBp.name"
                      >
                        <v-list-item-title>{{ item.name }}</v-list-item-title>
                      </v-col>
                      <v-col
                        :cols="item.image ? imageBp.price : noImageBp.price"
                        class="text-left"
                      >
                        <v-list-item-title>${{ item.price }}</v-list-item-title>
                      </v-col>
                      <v-col
                        :cols="item.cart ? imageBp.cart : noImageBp.cart"
                        class="text-right"
                      >
                        <v-btn :disabled="isDisabled(item)" x-small fab dark color="primary" @click="handleAddItemDialog(item)">
                            <v-icon dark>mdi-cart</v-icon>
                        </v-btn> 
                      </v-col>
                    </v-row>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-expand-transition>
    </v-card>
    <v-dialog v-model="addItemDialog" max-width="500">
      <v-card>
        <v-form ref="addItemForm">
          <v-card-title v-if="targetItem">
            <span class="headline">{{ targetItem.name }} details</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    outlined
                    required
                    type="number"
                    placeholder="Quantity"
                    :rules="getIntRules"
                    v-model.number="qty"
                  >
                  </v-text-field> 
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-textarea
                    outlined
                    placeholder="Special instructions e.g. No Onions"
                    v-model="specialInstructions"
                  >
                  </v-textarea> 
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary darken-1" text @click="handleAddItemDialogClose">Close</v-btn>
            <v-btn color="primary darken-1" text @click="onAddItem">Add</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import rules from '@/utils/validation';
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: "Menu",
  data() {
    return {
      show: false,
      targetItem: null,
      addItemDialog: false,
      specialInstructions: null,
      qty: null,
      imageBp: {
        image: "2",
        name: "7",
        price: "2",
        cart: "1"  
      },
      noImageBp: {
        name: "9",
        price: "2",
        cart: "1"  
      },
    }
  },
  props: ["store"],
  methods: {
    ...mapMutations([
      'addItemToCart'
    ]),
    toggleMenu() {
      return this.$store.cache.dispatch("fetchMenuItems", this.store)
        .then(() => this.show = !this.show)
        .catch(err => console.log(err))
    },
    isDisabled(item) {
      var targetItem = this.getCart.find(cartItem => cartItem.id === item.id);
      return !!targetItem;
    },
    formatInfo(info) {
      return info.reduce((acc, curr) => acc += ` ${curr},`, "");
    },
    handleAddItemDialog(item) {
      this.targetItem = item;
      this.addItemDialog = true;
    },
    onAddItem() {
      if (this.$refs.addItemForm.validate()) {
        this.addItemToCart({
          storeId: this.store.id,
          ...this.targetItem,
          qty: this.qty,
          specialInstructions: this.specialInstructions
        })
        this.handleAddItemDialogClose()
      }
    },
    handleAddItemDialogClose() {
      this.$refs.addItemForm.resetValidation();
      this.qty = null;
      this.specialInstructions = null;
      this.targetItem = null;
      this.addItemDialog = false;
    }
  },
  computed: {
    ...mapGetters({ getMenu: 'getMenu', getCart: 'getCart', getDeliveryDetails: 'getDeliveryDetails' }),
    getMenuItems() {
      var filteredItems = this.getMenu[this.store.id].filter(item => {
          return item.deliverySlots.includes(this.getDeliveryDetails.deliveryTime); 
      });
      return filteredItems;
    },
    getIntRules() {
      return [v => v > 0 || "Quantity must be at least 1",rules.required];
    },
  },
}
</script>

<style>
</style>