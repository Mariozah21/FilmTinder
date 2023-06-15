import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCGLOnF_DCfKGqGWL-h2YiwbKvS7jS-Zq8",
  authDomain: "filmtinder-30897.firebaseapp.com",
  projectId: "filmtinder-30897",
  storageBucket: "filmtinder-30897.appspot.com",
  messagingSenderId: "1068716190505",
  appId: "1:1068716190505:web:63d2cb66dce49f14e5e538"
};

  const firebaseApp = initializeApp(firebaseConfig);
  
  export default firebaseApp

