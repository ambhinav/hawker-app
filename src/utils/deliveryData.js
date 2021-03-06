export var deliverySlots = [
  "11:30",
  "14:00",
  "17:00"
]

export var deliveryTimingsUI = [
  { 
    orderBy: "11:30 AM",
    period: "12:30 PM - 2:30 PM"
  },
  { 
    orderBy: "2 PM",
    period: "3 PM - 5 PM"
  },
  { 
    orderBy: "5 PM",
    period: "6 PM - 8 PM"
  }
]

export var deliveryTimingsData = [
  { 
    slot: "11:30",
    period: "12:30 - 2:30"
  },
  { 
    slot: "14:00",
    period: "3 - 5"
  },
  { 
    slot: "17:00",
    period: "6 - 8"
  }
];

export var deliveryTimingsOnly = ["12:30 - 2:30", "3 - 5", "6 - 8"];

export var lastOrderTimings = [
  { 
    slot: "11:25",
    period: "12:30 - 2:30",
  },
  { 
    slot: "13:55",
    period: "3 - 5",
  },
  { 
    slot: "16:55",
    period: "6 - 8",
  }
]

export var deliveryTimingsMapping = {
  "A": "11 AM",
  "B": "12 PM",
  "C": "1 PM",
  "D": "2 PM",
  "E": "3 PM",
  "F": "4 PM",
  "G": "5 PM",
  "H": "6 PM",
  "I": "7 PM",
  "J": "8 PM",
  "K": "9 PM",
}

export function getFastingPeriodDeliveryTimingsMapping() {
  return Object.entries(deliveryTimingsMapping).filter(data => {
    const k = data[0];
    if (k == "E" || k == "F" || k == "G") {
      return true;
    }
    return false;
  })
}

export function isEmpty(obj) {
    for(var key in obj) {
        if(Object.prototype.hasOwnProperty.call(obj, key))
            return false;
    }
    return true;
}

/** Checks if each store that customer has ordered from has a minimum purchase of S$4 */
export function isMinimumPurchaseAmount(cart, order) {
  var isValid = true;
  for (var storeId in order) {
    var targetItems = order[storeId];
    var finalItems = cart.filter(cartItem => targetItems.includes(cartItem.id));
    var total = finalItems.reduce((acc, currItem) => { 
        return acc + (parseFloat(currItem.price) * parseInt(currItem.qty))
      }, 0)
    if (total < 4.00) {
      isValid = false;
    }
  }
  return isValid;
}

export const SMALL_ORDER_FEE_ONE = 4.00;
export const SMALL_ORDER_FEE_TWO = 3.00;

export const DELIVERY_ALERT = `Delivery fee:\nWithin 8km - $6.\nBetween 8km to 20km - $9.\nAbove 20km - $12.\nPlease note that a small order fee may be applied if applicable.`;

export const STORE_ALERT = `Please note that there is a minimum spend of $4 for each shop that you buy from.\nThere is a small order fee of $4 imposed for orders less than $10 and a fee of $3 for orders between $10 and $30. There is no small order fee if your purchase is $30 and above.\nPlease check out by 5pm.`