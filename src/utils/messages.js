const STORE_USER = [
  {
    message: "Minimum spend of $4 each shop."
  },
  {
    message: "There is a small order fee for food value below $30."
  },
];

const SMALL_ORDER_FEE = [
	{
		message: "To remove small order fee, please spend at least $30"
	}
];

const DELIVERY_FEE = [
	{
		message: "Delivery fee details:"
	},
	{
		message: "Within 8km: $6"
	},
	{
		message: "Between 8km and 20km: $9"
	},
	{
		message: "Above 20km: $12"
	}
]

export default {
	STORE_USER,
	SMALL_ORDER_FEE,
	DELIVERY_FEE
};
