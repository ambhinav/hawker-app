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
										<span style="font-weight: 300">No. of Expenses</span>
										<span style="font-weight: 300">{{ getExpenses.length }}</span>
									</v-card-title>
								</v-card>
							</v-flex>
						</v-col>
            <v-spacer></v-spacer>
					</v-row>
				</v-layout>
        <v-layout row wrap class="mt-5">
					<v-row no-gutters>
						<v-col cols="12">
							<v-flex xs12>
								<v-data-table
									:headers="headers"
									:items="getExpenses"
									class="elevation-1"
								>
                  <template v-slot:item.created_at="{ item }">
                    {{ formatDate(item.created_at) }}
									</template>
                 <template v-slot:item.expenses="{ item }">
                    <v-btn @click="viewExpenditure(item)">view</v-btn>
									</template> 
								</v-data-table>
							</v-flex>
						</v-col>
					</v-row>
				</v-layout>
			</v-container>
		</v-card>
    <v-dialog v-model="showExpenditure" max-width="600">
      <v-card v-if="targetExpenditure">
        <v-container>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left text-h5">Store Name</th>
                  <th class="text-left text-h5">Store ID</th>
                  <th class="text-left text-h5">Amount due ($)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(cost, storeId) in targetExpenditure.expenses" :key="storeId">
                  <td>{{ getStoreName(storeId) }}</td>
                  <td>{{ storeId }}</td>
                  <td class="text-center">{{ parseFloat(cost).toFixed(1) }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-simple-table class="pt-5">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left text-md-h5">Delivery Cost ($)</th>
                  <th class="text-left text-md-h5">Number of Orders</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(num, cost) in targetExpenditure.deliveryPricings" :key="num">
                  <td class="text-center">{{ cost }}</td>
                  <td class="text-center">{{ num }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="handleViewDetailsClose()">close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { formatDateShort } from '@/utils/dateTimeUtil';
export default {
  name: "Expenses",
  created () {
    this.$store.cache.dispatch("initExpenses");
    this.$store.cache.dispatch("initStores");
  },
  data () {
    return {
      headers: [
				{ 
					text: 'Date', 
					align: 'left', 
					value: 'created_at' 
        },
        { 
					text: "Number of orders", 
					align: 'left', 
					value: 'numberOfOrdersCompleted' 
        },
				{ 
					text: "Details", 
					align: 'left', 
					value: 'expenses' 
        },
      ],
      targetExpenditure: null,
      showExpenditure: false,
    }
  },
  computed: {
    ...mapGetters(["getExpenses", "getStores"])
  },
  methods: {
    viewExpenditure(expenditure) {
      this.targetExpenditure = expenditure;
      this.showExpenditure = true;
    },
    getStoreName(storeId) {
      return this.getStores.find(store => store.id == storeId).name;
    },
    formatDate(date) {
      return formatDateShort(date);
    },
    handleViewDetailsClose() {
      this.targetExpenditure = null;
      this.showExpenditure = null;
    }
  }
}
</script>

<style>

</style>