<template>
  <nav>
    <v-app-bar app color="primary" elevation="0">
      <v-app-bar-nav-icon
        @click="drawer = true"
        class="hidden-md-and-up"
      ></v-app-bar-nav-icon>
      <!-- <v-avatar :tile="true" size="96" >
        <v-img :src="require('@/assets/logo.svg')"></v-img>
      </v-avatar> -->
      <v-btn to="/" text>
        <v-img 
          contain 
          :src="require('@/assets/logo.svg')"
          max-height="120"
          max-width="150"
          >
        </v-img>
      </v-btn>
      <!-- <v-toolbar-title>
        <v-btn to="/">
          <v-img :src="require("@/assets/logo.svg")"></v-img>
        </v-btn>
      </v-toolbar-title> -->
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
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
    },
  }
};
</script>

<style></style>
