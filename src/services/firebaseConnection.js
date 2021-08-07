import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

var firebaseConfig = {
    apiKey: "AIzaSyDSZZ9eRl3yHCSFMb8buWAibC2zEeBfcCQ",
    authDomain: "sistema-chamado-d69ba.firebaseapp.com",
    projectId: "sistema-chamado-d69ba",
    storageBucket: "sistema-chamado-d69ba.appspot.com",
    messagingSenderId: "878083667215",
    appId: "1:878083667215:web:4162c4be9e668f273f7a7a",
    measurementId: "G-ZT2FDK14LG"
  };

// check if have connection already started
if (!firebase.apps.length) {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
}

export default firebase;