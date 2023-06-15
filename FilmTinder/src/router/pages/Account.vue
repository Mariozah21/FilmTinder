<template>
    <div>
      <h1>Account Information</h1>
      <form @submit.prevent="submitForm">
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="name" required>
        <br><br>
        <label for="name">Surname:</label>
        <input type="text" id="surname" v-model="surname" required>
        <br><br>
        <label for="age">Age:</label>
        <input type="number" id="age" v-model="age" required>
        <br><br>
        <label for="gender">Gender:</label>
        <select id="gender" v-model="gender" required>
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <br><br>
        <button type="submit">Save</button>
      </form>
    </div>
</template>
  
<script setup lang="ts">
import { ref } from 'vue';
import 'firebase/firestore';
import firebaseApp from '@/config';
import { addDoc, collection, getFirestore, doc, updateDoc, getDocs, query, where,setDoc } from '@firebase/firestore';
import store from '@/stores/passStore';



// Initialize Firestore
const db = getFirestore(firebaseApp)
const collectionAccount = collection(db, "account");

// Refs for form inputs
    const name = ref('');
    const age = ref('');
    const gender = ref('');
    const surname = ref('');
    



// Function to handle form submission and save data to Firestore
const submitForm = async () => {
  try {
    // Check if user exists with password hash in account and account collection
    console.log(store.state.email);  
    const q = query(collectionAccount, where("email", "==", store.state.email));
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot.docs.length)
    querySnapshot.forEach((doc) => {
      const accountRef = doc.ref;
      updateDoc(accountRef, {
        name: name.value,
        surname: surname.value,
        gender: gender.value,
        age: age.value
      })
        .then(() => {
          
          console.log("User data updated successfully!");
        })
        .catch((error) => {
          console.error("Error updating user data: ", error);
        });
    });
  } catch (error) {
    console.error('Error checking if user exists: ', error);
  }
};



  
  




</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  font-weight: bold;
}

input, select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
}

button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

button:hover {
  background-color: #0069d9;
}
</style>