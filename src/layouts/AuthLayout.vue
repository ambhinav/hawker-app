<template>
  <v-app>
    <SnackbarSuccess v-if="status == 'success'" /> 
    <SnackbarFailure v-else-if="status == 'failure'" />
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import SnackbarSuccess from "@/components/feedback/SnackbarSuccess";
import SnackbarFailure from "@/components/feedback/SnackbarFailure";
export default {
  name: "AuthLayout",
  components: {
    SnackbarSuccess,
    SnackbarFailure
  },
  computed: {
    ...mapState({
      status: state => state.feedback.status
    })
  },
}
</script>