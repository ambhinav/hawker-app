const HAWKER_ADDRESS = {
  "HR": "14 Haig Rd, Singapore 430014",
  "EM": "4A Eunos Cres, Singapore 402004",
  "GS": "1 Geylang Serai, Singapore 402001",
  "AD": "2 Adam Rd, Singapore 289877",
  "UB": "17 Upper Boon Keng Rd, Singapore 380017",
  "AR": "Blk 503, West Coast Drive. Ayer Rajah Food Centre, Singapore 120503",
  "ME": "11 Kaki Bukit Rd 4, Singapore 417806"
};

const PICKUP_TIMINGS = {
  "A": "10:15 AM",
  "B": "11:15 AM",
  "C": "12:15 PM",
  "D": "1:15 PM",
  "E": "2:15 PM",
  "F": "3:15 PM",
  "G": "4:15 PM",
  "H": "5:15 PM",
  "I": "6:15 PM",
  "J": "7:15 PM",
  "K": "8:15 PM",
};

/**
 * Calculates rider earnings based on the delivery cost.
 * @param {*} deliveryCost
 */
const getRiderEarnings = deliveryCost => {
  switch (deliveryCost) {
    case 6:
      return 10;
    case 9:
      return 13;
    case 12:
      return 15;
  }
};

module.exports = {
    HAWKER_ADDRESS,
    PICKUP_TIMINGS,
    getRiderEarnings
};
