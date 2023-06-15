<template>
    <v-card class="mx-auto" max-width="344">
      <v-card-title class="headline">User Registration</v-card-title>
      <v-container>
        <v-text-field v-model="email" label="Email" variant="outlined"></v-text-field>
        <v-text-field v-model="name" label="Username" variant="outlined"></v-text-field>
        <v-text-field v-model="password" label="Password" variant="outlined" placeholder="Enter your password"></v-text-field>
      </v-container>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="button" large @click="register">
          Complete Registration
          <v-icon right>mdi-chevron-right</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </template>





<script setup lang="ts">
    import { ref } from "vue";
    import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
    import { addDoc, collection, getFirestore, doc, query,where, getDocs, setDoc} from '@firebase/firestore';
    import { useRouter } from "vue-router";
    import firebaseApp from '@/config';
    import 'firebase/firestore';
    import bcrypt from 'bcryptjs';
    import store from '@/stores/passStore';

    const router = useRouter();

    const db = getFirestore(firebaseApp)
    const collectionAccount = collection(db, "account");

    // Refs for form inputs
    const name = ref('');
    const age = ref('');
    const gender = ref('');
    const surname = ref('');
    const email = ref("");
    const password = ref("");



    const passHash = ref ('');



    //Register
    const register = () => {
        createUserWithEmailAndPassword(getAuth(), email.value, password.value).then((userCredential) => {
            router.push({ name: 'Feed' });
            console.log(userCredential);
            submitForm()
        })
            .catch((error) => {
                console.log(error);
            });


    };


    // Initialize Firestore


const submitForm = async () => {
  await store.dispatch('setEmail', email.value);

  try {
    const accountDocRef = doc(collectionAccount, email.value);

    await setDoc(accountDocRef, {
      username: name.value,
      email: email.value,
    });

    // Clear form inputs
    name.value = '';
    password.value = '';

    alert('Account information saved successfully!');
  } catch (error) {
    console.error('Error saving account information: ', error);
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
        background-color: #fff;
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