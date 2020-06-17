import firebase from 'firebase'
import firebaseConfig from '../../secrets/firebase'

// Initialise firebase
const firebaseApp = firebase.initializeApp(firebaseConfig)

export var db = firebaseApp.firestore()
export var storage = firebaseApp.storage()
export var auth = firebaseApp.auth()
export var functions = firebaseApp.functions()