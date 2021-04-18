const parse = require("csv-parse");
const admin = require("firebase-admin");
const dataPath = "./data.csv";
const storeId = "HSR01-04";
const fs = require("fs");
const { PICKUP_TIMINGS } = require("./utils/messageHelpers");
const { firebaseConfig } = require("../secrets/firebase");
var { databaseURL } = firebaseConfig;
var serviceAccount = require("../secrets/halale-56586-firebase-adminsdk-hp0fm-3ea70c58e9.json");
var config = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL,
};

// Initialise firebase
admin.initializeApp(config);

var parser = parse({ delimiter: "," }, async (err, data) => {
  // Step 1: Parse CSV data
  var menuItems = [];
  // Column names: Item name, Slots, Price (NM), Price (AM), Add ons
  for (var i = 1; i < data.length; ++i) {
    // ignore empty rows
    if (data[i][0] === "") {
      continue;
    }
    let slots = [];
    if (data[i][1].toUpperCase() == "ALL") {
      slots = Object.keys(PICKUP_TIMINGS);
    } else {
      slots = data[i][1].split(",");
    }
    const item = {
      name: data[i][0],
      slots,
      nm: parseFloat(data[i][2].replace(/\$/g, "")),
      price: parseFloat(data[i][3].replace(/\$/g, "")),
    };
    menuItems.push(item);
  }

  // Step 2: Upload to firebase
  for (var j = 0; j < menuItems.length; ++j) {
    const item = menuItems[j];
    const itemRef = await admin
      .firestore()
      .collection("Menu")
      .add({ ...item });

    admin
      .firestore()
      .collection("Stores")
      .doc(storeId)
      .update({
        // update the list of items the store carries
        menu: admin.firestore.FieldValue.arrayUnion(itemRef.id),
      });
  }

  // for testing purposes
  // fs.writeFile("./data.json", JSON.stringify(menuItems), (err) => {
  // 	if (err) {
  // 		console.log("Error writing file", err);
  // 	} else {
  // 		console.log("Successfully wrote file");
  // 	}
  // });
});

fs.createReadStream(dataPath).pipe(parser);
