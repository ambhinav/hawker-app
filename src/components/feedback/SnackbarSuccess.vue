<template>
	<div>
		<v-snackbar v-model="show" :timeout="5000" top color="success" >
				<span>{{ message }}</span>
				<v-btn text color="white" @click="handleClose">Close</v-btn>
		</v-snackbar>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
	name: 'Snackbar',
	data () {
		return {
			show: true // default,
		}
	},
	methods: {
		...mapActions({
			clearToast: 'clearToast'
		}),
		handleClose() {
			this.show = false
		}	
	},
    computed: {
		...mapState({
			message: state => state.feedback.message
		})
	}
}
</script>

<style>

</style>