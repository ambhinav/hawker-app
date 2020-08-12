export var deliverySlots = [
  "11:30",
  "14:00",
  "17:00"
]

export var lastOrderTimings = [
  { 
    slot: "11:20",
    period: "12 - 2",
  },
  { 
    slot: "13:50",
    period: "3 - 5",
  },
  { 
    slot: "16:50",
    period: "6 - 8",
  }
]

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