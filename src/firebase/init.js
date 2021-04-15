//import * as Firebase from 'firebase/app';
import firebase from "firebase";
import { firebaseConfig } from "../../secrets/firebase";
var {
  apiKey,
  authDomain,
  databaseURL,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId
} = firebaseConfig;

var config = {
  apiKey,
  authDomain,
  databaseURL,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId
};

// Initialise firebase
const firebaseApp = firebase.initializeApp(config);

// Enable emulator for dev environment
// This ensures cloud functions can be tested before being deployed
// and firestore production will not be affected
// if (window.location.hostname === 'localhost') {
//   Firebase.firestore().settings({ host: 'localhost:8080', ssl: false });
//   Firebase.functions().useFunctionsEmulator('http://localhost:5001');
// }

export var db = firebaseApp.firestore();
export var storage = firebaseApp.storage();
export var auth = firebaseApp.auth();
export var functions = firebaseApp.functions();
