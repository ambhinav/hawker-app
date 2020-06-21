<template>
  <nav>
    <v-app-bar app color="primary">
      <v-app-bar-nav-icon
        @click="drawer = true"
        class="hidden-md-and-up"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>
        <v-btn text to="/">
          Halale
        </v-btn>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn icon>
          <v-icon color="secondary">mdi-cart</v-icon>
        </v-btn>
        <v-btn text to="/about">
          About
        </v-btn>
        <v-btn text to="/contact">
          Contact us
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <!-- Start of mobile side menu -->
    <v-navigation-drawer absolute v-model="drawer" left temporary>
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="primary text--accent-3"
        >
          <v-list-item
            v-for="(item, i) in items" 
            :key="i"
            @click="changeRoute(item.link)"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <!-- End of mobile side menu -->
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      drawer: false,
      group: null,
      items: [
        {
          icon: "mdi-home", title: "Home", link: "/"
        },
        {
          icon: "mdi-cart", title: "Cart", link: "/"
        },
        {
          icon: "mdi-information", title: "About", link: "/about"
        },
        {
          icon: "mdi-tooltip-account", title: "Contact Us", link: "/contact"
        },
      ]
    };
  },
  methods: {
    changeRoute(link) {
      this.$router.push(link);
    }
  }
};
</script>

<style></style>
