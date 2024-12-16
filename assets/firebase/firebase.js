import firebase from "firebase/compat/app";
import "firebase/compat/database";

const firebaseConfig = {
  apiKey: "AIzaSyD9S25yZNYsSpuCwdjEMKYsxf9y1XQX3dg",
  authDomain: "mobiluygulamaodevidb.firebaseapp.com",
  databaseURL: "https://mobiluygulamaodevidb-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mobiluygulamaodevidb",
  storageBucket: "mobiluygulamaodevidb.firebasestorage.app",
  messagingSenderId: "118873996623",
  appId: "1:118873996623:web:1af9dc85839f1bc7f7593a",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
