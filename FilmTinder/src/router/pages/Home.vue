<template>
  <div class="home">
    <v-app>
      <v-main>
        <v-container fluid>
          <v-row justify="center" align="center" class="film-tinder-row">
            <v-col cols="12" sm="10" md="8" lg="6">
              <div class="film-tinder">
                <h1 class="text-center mb-4">FilmTinder</h1>
                <p class="subtitle-1 text-center">
                  Discover movies to watch with your friends or soulmates
                </p>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script lang="ts">
import { onMounted } from 'vue';

export default {
  name: 'Home',
  setup() {
    onMounted(() => {
      animateFilmTinder();
    });

    const animateFilmTinder = () => {
      const filmTinder = document.querySelector('.film-tinder');
      filmTinder!!.classList.add('animate-film-tinder');
    };

    return {};
  },
};
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.film-tinder-row {
  height: 100vh;
}

.film-tinder {
  text-align: center;
}

.animate-film-tinder {
  animation: fadeIn 1s ease-in-out, slideUp 1s ease-in-out;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes slideUp {
  0% {
    transform: translateY(100px);
  }
  100% {
    transform: translateY(0);
  }
}

.display-1 {
  font-size: 48px;
  font-weight: bold;
  color: #FF4081;
  animation: textGlow 2s infinite alternate;
}

.subtitle-1 {
  font-size: 24px;
  color: #757575;
}

@keyframes textGlow {
  0% {
    text-shadow: 0 0 10px rgba(255, 64, 129, 0.5);
  }
  50% {
    text-shadow: 0 0 20px rgba(255, 64, 129, 1);
  }
  100% {
    text-shadow: 0 0 10px rgba(255, 64, 129, 0.5);
  }
}
</style>
