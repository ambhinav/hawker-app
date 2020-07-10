<template>
  <v-card flat>
    <v-card-title>
      Contact Requests
    </v-card-title>
    <v-card-text>
      <v-expansion-panels>
        <v-expansion-panel
          v-for="(request,i) in getContactRequests"
          :key="i"
        >
          <v-expansion-panel-header>{{ request.fullName }} - {{ request.category }}</v-expansion-panel-header>
          <v-expansion-panel-content>
            Details: {{ request.details }}
            <br>
            Email: {{ request.email }}
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: "AdminContact",
  created() {
    this.initContact()
  },
  computed: {
    ...mapGetters(["getContactRequests"])
  },
  methods: {
    ...mapActions(["initContact"])
  }
}
</script>

<style>

</style>