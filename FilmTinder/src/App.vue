<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import router from "./router";
import store from "./stores/passStore";
import friendStore  from './stores/friendStore';

const isLoggedIn = ref(false)

function resetFeedFriend(){
  friendStore.dispatch('setUser', null )
}

let auth: any;

onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;
    } else {
      isLoggedIn.value = false;
    }
  });
  document.title = "Film Tinder"
});





const handleSignOut = () => {
  store.dispatch('setPassword', '');
  signOut(auth).then(() => {
    router.push({ name: 'Login' });
  }).catch((error) => {
    console.log(error);
  });
};
</script>

<template>
  <v-app>
    <v-row>
      <v-app-bar app class="navbar row" dark elevate-on-scroll>
        <nav class="col-2">
          <v-toolbar-title>
            <router-link to="/" class="mr-4 button" >Home</router-link>
          </v-toolbar-title>
        </nav>
        <nav v-if="isLoggedIn" class="col-2">
          <v-toolbar-title>
            <router-link to="/feed" class="mr-4 button" @click="resetFeedFriend">Feed</router-link>
          </v-toolbar-title>
        </nav>
        <nav v-if="isLoggedIn" class="col-2">
          <v-toolbar-title>
            <router-link to="/likedfilms" class="mr-4 button" @click="resetFeedFriend">Liked</router-link>
          </v-toolbar-title>
        </nav>
        <nav v-if="isLoggedIn" class="col-2 ">
          <v-toolbar-title>
            <router-link to="/friendsList" class="mr-4 button" @click="resetFeedFriend">Friends</router-link>
          </v-toolbar-title>
        </nav>
        <nav v-if="isLoggedIn">
          <div class="text-right">
          <router-link to="/searchfilms" @click="resetFeedFriend">
            <v-btn class="button" fab  dark>
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </router-link>
          </div>
        </nav>
        <nav v-if="!isLoggedIn" class="cols=7"></nav>
        <nav class="col-4 text-right">
          <v-toolbar-title>
            <v-btn v-if="isLoggedIn" @click="handleSignOut" class="mr-4 button">Sign Out</v-btn>
            <router-link v-else to="/login" class="text-right r-4 button">Login</router-link>
          </v-toolbar-title>
        </nav>


      </v-app-bar>
    </v-row>

    <v-main>
      <v-container class="mt-8">
        <router-view></router-view>
      </v-container>
    </v-main>

    <footer class="footer">
      <span class="footer">&copy; 2023 FilmTinder</span>
    </footer>
  </v-app>
</template>

<style>
@import 'vuetify/dist/vuetify.min.css';

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.mt-8 {
  margin-top: 8px;
}


</style>









