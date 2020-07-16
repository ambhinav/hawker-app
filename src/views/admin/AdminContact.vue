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
          <v-expansion-panel-header>{{ request.category }} - {{ formatDate(request.created_at) }}</v-expansion-panel-header>
          <v-expansion-panel-content>
            Name: {{ request.fullName }}
            <br>
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
import { mapGetters, mapActions } from 'vuex';
import { formatTimeAndDate } from "@/utils/dateTimeUtil";
export default {
  name: "AdminContact",
  created() {
    this.initContact()
  },
  computed: {
    ...mapGetters(["getContactRequests"]),
  },
  methods: {
    ...mapActions(["initContact"]),
    formatDate(timestamp) {
      return formatTimeAndDate(timestamp);
    }
  }
}
</script>

<style>

</style>