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
} = firebaseConfig

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
const firebaseApp = firebase.initializeApp(config)

export var db = firebaseApp.firestore()
export var storage = firebaseApp.storage()
export var auth = firebaseApp.auth()
export var functions = firebaseApp.functions()