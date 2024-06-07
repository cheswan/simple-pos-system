
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAN1Mwec4mX62sOvwkIHl8-efPb4hWGQYc",
  authDomain: "posale-553a0.firebaseapp.com",
  databaseURL: 'https://posale-553a0-default-rtdb.asia-southeast1.firebasedatabase.app/',
  projectId: "posale-553a0",
  storageBucket: "posale-553a0.appspot.com",
  messagingSenderId: "583250993876",
  appId: "1:583250993876:web:7ff95e4caed52c15709141"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();
const storage = firebase.storage();

export { firebase, auth, database, storage }


