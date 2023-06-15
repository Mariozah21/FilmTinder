<template>
  <v-sheet class="pa-12" rounded>
    <v-card class="mx-auto px-6 py-8" max-width="344">
      <v-form class="" v-model="form" @submit.prevent="onSubmit">
        <v-text-field v-model="email" :readonly="loading" :rules="[required]" class="mb-2 textField rounded-lg" clearable
          label="Email"></v-text-field>
        <v-snackbar v-model="errorMessage.show" :timeout="errorMessage.duration" :color="errorMessage.color">
          {{ errorMessage.message }}
          <v-btn text @click="dismissErrorMessage">Close</v-btn>
        </v-snackbar>
        <v-text-field class="rounded-lg textField" v-model="password" :readonly="loading" :rules="[required]" clearable
          label="Password" placeholder="Enter your password"></v-text-field>

        <br>

        <div class="text-center mt-3">
          <btn class="button" color="#a8dadc" :disabled="!form" :loading="loading" block size="large"
            type="submit" variant="elevated" @click="login">
            Sign In
          </btn>
          <p>Don't have an account? <router-link to="/register">Register</router-link></p>
          <p>Or sign in with:</p>
          <btn class="button" @click="signInWithGoogle">
            <v-icon left>mdi-google</v-icon>
            Sign In With Google
          </btn>

        </div>
      </v-form>
    </v-card>
  </v-sheet>
</template>







  
  

<script setup lang="ts">
import { ref } from "vue";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, addDoc, getDoc, doc, setDoc } from 'firebase/firestore';
import bcrypt from 'bcryptjs';
import { useRouter } from "vue-router";
import store from "@/stores/passStore";
import firebaseApp from "@/config";
import firebase from 'firebase/app';
import 'firebase/auth';
const email = ref("");
const password = ref("");
const router = useRouter();
const passHash = ref('');
const form = ref(false);
const loading = ref(false);

const errorMessage = ref({
  show: false,
  message: "",
  color: "red",
  duration: 5000,
});

const dismissErrorMessage = () => {
  errorMessage.value.message = "";
  errorMessage.value.show = false;
};
const onSubmit = () => {
  if (!form.value) return;

  loading.value = true;

  setTimeout(() => (loading.value = false), 2000);
};
const required = (v: any) => {
  return !!v || 'Field is required';
};
const db = getFirestore(firebaseApp)
const collectionAccount = collection(db, "account");

const login = () => {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      console.log(userCredential);
      router.push({ name: 'Feed' });
      console.log(userCredential);
    })
    .catch((error) => {
      console.log(error);
      if (typeof error.code === 'string') {
        switch (error.code) {
          case "auth/invalid-email":
            errorMessage.value.message = "Invalid Email";
            break;
          case "auth/user-disabled":
            errorMessage.value.message = "User Disabled";
            break;
          case "auth/user-not-found":
            errorMessage.value.message = "User Not Found";
            break;
          case "auth/wrong-password":
            errorMessage.value.message = "Wrong Password";
            break;
        }
        showErrorMessage(errorMessage.value.message);
      }
    });
};








const showErrorMessage = (message: string) => {
      errorMessage.value.message = message;
      errorMessage.value.show = true;

      setTimeout(() => {
        dismissErrorMessage();
      }, errorMessage.value.duration);
    };


const dispatchToStore = async (password: string) => {
  passHash.value = await bcrypt.hash(password, 10);
  store.dispatch('setEmail', email.value);
  console.log(store.state.email)
};


const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    const result = await signInWithPopup(auth, provider);

    // Get the authenticated user's email
    const email = result.user.email;
    const name = result.user.displayName;

    // Check if the user already exists in the Firestore collection
    const firestore = getFirestore();
    const accountCollectionRef = collection(firestore, 'account');
    const userDocRef = doc(accountCollectionRef, email!!);
    const userDocSnapshot = await getDoc(userDocRef);

    if (!userDocSnapshot.exists()) {
      const newAccount = {
        username: name,
        email: email,
      };
      await setDoc(userDocRef, newAccount);
      store.dispatch('setEmail', email);
    }

    router.push({ name: 'Feed' });
    console.log('User logged in:', result.user);
  } catch (error) {
    console.log('Error signing in with Google:', error);
  }
};



</script>

<style>
form {
  max-width: 300px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}
</style>