// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebaseConfig from "./_firebaseConfig";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const auth = getAuth(app);

signInWithEmailAndPassword( auth, 'denki.club.mori@gmail.com', 'denkimori0378' )
.then( ()=> {
    console.log( 'login success' );
} )
.catch( ()=> {
    console.error( 'login failed' );
} )

export {firestore, auth};
