// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCsSQ7CJoyeuh6Om5hoV5Vh35ahyDVo8EY",
    authDomain: "realtor-clone-reactjs-project.firebaseapp.com",
    projectId: "realtor-clone-reactjs-project",
    storageBucket: "realtor-clone-reactjs-project.appspot.com",
    messagingSenderId: "565717761759",
    appId: "1:565717761759:web:326f0b8b39284a2e02b36a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();