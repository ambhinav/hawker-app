<template>
  <v-card
    class="mx-auto"
    max-width="600"
  >
    <v-img
      :src="store.image"
      height="200px"
    ></v-img>

    <v-card-title>
      {{ store.name }}
    </v-card-title>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        icon
        @click="toggleMenu"
      >
        <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <p>
                Food
              </p>
              <v-list class="transparent">
                <v-list-item
                  v-for="(food, i) in getMenuItems[0]"
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
                          v-if="food.image"
                          alt="Food"
                          :src="food.image"
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
                      <v-list-item-title>{{ food.name }}</v-list-item-title>
                    </v-col>
                    <v-col
                      cols="1"
                      class="text-right"
                    >
                      <v-list-item-title>{{ food.price }}</v-list-item-title>
                    </v-col>
                    <v-col
                      cols="2"
                      class="text-right"
                    >
                      <v-btn x-small fab dark color="primary">
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
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: "Menu",
  data() {
    return {
      show: false
    }
  },
  props: ["store"],
  methods: {
    toggleMenu() {
      return this.show = !this.show
    },
  },
  computed: {
    ...mapGetters({ getMenu: 'getMenu' }),
    getMenuItems() {
      var targetItems = this.getMenu.filter(item => {
        var targetItem = this.store.menu.find(itemId => itemId === item.id);
        return !!targetItem;
      })
      var food = targetItems.filter(item => item.category == "Food");
      var drinks = targetItems.filter(item => item.category === "Drinks");
      console.log(food)
      return [food, drinks]
    }
  },
}
</script>

<style>
</style>