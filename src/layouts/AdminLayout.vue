<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      elevation="0"
    >
      <SnackbarSuccess v-if="status == 'success'" /> 
      <SnackbarFailure v-else-if="status == 'failure'" />
      <div class="d-flex align-center">
        <v-img
          src="Vuetify Logo"
          class="shrink mr-2"
          contain
          transition="scale-transition"
          width="30"
        />
      </div>
      <v-toolbar-title id="title">HALALE ADMIN</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-navigation-drawer
      app
      left
      permanent
    >
      <v-list-item style="color: white">
        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
        </v-list-item-avatar>
      </v-list-item>
      <v-divider></v-divider>
      <v-list>
        <router-link id="link" to='/admin'>
          <v-list-item link>
              <v-list-item-icon>
                <v-icon>mdi-sale</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Orders</v-list-item-title>
              </v-list-item-content>
          </v-list-item>
        </router-link>
        <router-link id="link" to='/admin/stores'>
          <v-list-item link>
              <v-list-item-icon>
                <v-icon>mdi-cart-minus</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Stores</v-list-item-title>
              </v-list-item-content>
          </v-list-item>
        </router-link>
        <router-link id="link" to='/admin/onboarding'>
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-train-car</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Onboarding</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn @click="signOut()" style="color: white" color="red" block>Log Out</v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import SnackbarSuccess from '@/components/feedback/SnackbarSuccess';
  import SnackbarFailure from '@/components/feedback/SnackbarFailure';
  export default {
    data () {
      return {}
    },
    components: {
      SnackbarSuccess,
      SnackbarFailure
    },
    methods: {
      ...mapActions({
        successToast: 'successToast',
        errorToast: 'errorToast',
        logOut: 'logOut'
      }),
      signOut() {
        this.logOut().then(() => {
          this.$router.push({ name: 'SignIn' })
          this.successToast('Signed out!')  
        }).catch(() => this.errorToast("Error signing out"))
      },
    },
    computed: {
      ...mapState({
        status: state => state.feedback.status
      })
    },
  }
</script>

<style>
#link{
    text-decoration: none;
}
#title {
  margin-left: 0px;
  font-family: 'Palanquin Dark', sans-serif;
  font-size: 40px;
  letter-spacing: -1.5px;
}
</style>