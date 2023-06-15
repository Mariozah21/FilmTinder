import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '../src/App.vue'
import router from './router'
import vuetify from "./plugins/vuetify";
import './assets/main.css'
// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


// Initialize Firebase



const app = createApp(App)

app.use(createPinia())
app.use(vuetify)
app.use(router)

app.mount('#app')
