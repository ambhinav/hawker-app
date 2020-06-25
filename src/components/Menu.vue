<template>
  <div>
    <v-card
      class="mx-auto"
      max-width="600"
      :disabled="!store.enabled"
    >
      <v-img
        :src="store.image"
        height="200px"
      ></v-img>

      <v-card-title>
        {{ store.name }}
      </v-card-title>
      <v-card-subtitle>
        <b>Operating days</b>: {{ formatInfo(store.operatingTimes) }}
        <br>
        <b>Operating delivery slots</b>: {{ formatInfo(store.deliveryTimings) }}
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

      <v-expand-transition>
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
                        cols="2"
                      >
                        <v-avatar
                        size="40px"
                        rounded
                        >
                          <img
                            v-if="item.image"
                            :src="item.image"
                          >
                          <v-icon
                            v-else
                          >
                          </v-icon>
                        </v-avatar>
                      </v-col>
                      <v-col
                        cols="7"
                      >
                        <v-list-item-title>{{ item.name }}</v-list-item-title>
                      </v-col>
                      <v-col
                        cols="1"
                        class="text-right"
                      >
                        <v-list-item-title>{{ item.price }}</v-list-item-title>
                      </v-col>
                      <v-col
                        cols="2"
                        class="text-right"
                      >
                        <v-btn :disabled="isDisabled(item)" x-small fab dark color="primary" @click="handleAddItemDialog(item)">
                            <v-icon dark>mdi-plus</v-icon>
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
          <v-card-title>
            <span class="headline">Item details</span>
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
    }
  },
  props: ["store"],
  methods: {
    ...mapMutations([
      'addItemToCart'
    ]),
    toggleMenu() {
      return this.show = !this.show
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
    ...mapGetters({ getMenu: 'getMenu', getCart: 'getCart' }),
    getMenuItems() {
      var targetItems = this.getMenu.filter(item => {
        var targetItem = this.store.menu.find(itemId => itemId === item.id);
        return !!targetItem;
      })
      return targetItems
    },
    getIntRules() {
      return [v => v > 0 || "Quantity must be at least 1",rules.required];
    },
  },
}
</script>

<style>
</style>