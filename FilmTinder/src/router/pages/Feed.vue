<template>
    <div class="container">
        <h3 v-if="friend">You are matching with: {{ $route.params.friendName }}</h3>
        <v-container>
            <v-carousel :show-arrows="false" hide-delimiter-background v-model="currentSlide" class="card-stack"
                hide-delimiters :cycle="false">
                <v-carousel-item v-for="(movie, index) in movies" :key="movie.id">
                    <div class="card tinder-card">
                        <div class="card-body d-flex align-items-center">
                            <div class="trash-button" @click="prevSlide">
                                <v-icon class="trash-icon">mdi-delete</v-icon>
                            </div>
                            <div class="card-content">
                                <div class="movie-details">
                                    <h5 class="card-title">{{ movie.title }}</h5>
                                    <v-img :src="getImageUrl(movie.poster_path)" aspect-ratio="2/3"
                                        class="movie-poster"></v-img>
                                    <div class="overview-row">
                                        <v-icon class="overview-icon bg-white" color="black"
                                            @click="toggleOverview(index)">mdi-chevron-up
                                        </v-icon>
                                        <div v-if="showOverview === index" class="overview-sheet">
                                            <v-icon class="overview-icon bg-white" color="black"
                                                @click="toggleOverview(undefined)">mdi-chevron-down</v-icon>
                                            <p class="card-text">{{ movie.overview }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="like-button" @click="nextSlide">
                                <v-icon class="like-icon">mdi-heart</v-icon>
                            </div>
                            <v-dialog v-model="isMatchDialogVisible" @closed="isMatchDialogVisible = false">
                                <v-card>
                                    <div class="match-message">
                                        <p class="match-text">
                                            <span class="fancy-animation">It's</span>
                                            <span class="fancy-animation">a</span>
                                            <span class="fancy-animation">Match</span>
                                        </p>
                                        <div class="fireworks">
                                            <div class="firework firework1"></div>
                                            <div class="firework firework2"></div>
                                            <div class="firework firework3"></div>
                                            <div class="firework firework4"></div>
                                            <div class="firework firework5"></div>
                                            <div class="firework firework6"></div>
                                            <div class="firework firework7"></div>
                                            <div class="firework firework8"></div>
                                            <div class="firework firework9"></div>
                                            <div class="firework firework10"></div>
                                        </div>
                                    </div>
                                </v-card>
                            </v-dialog>
                        </div>
                    </div>
                </v-carousel-item>
            </v-carousel>
        </v-container>
    </div>
</template>

<script lang="ts">
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import '@/assets/bootstrap.min.css';
import { addMovieToCollection, isMovieInCollection, getMoviesInCollection, CompareMovieToCollection } from '../BackEnd/components'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Movie, User } from '../BackEnd/Interfaces'
import friendStore from '@/stores/friendStore';

export default {
    name: 'MovieFeed',
    components: {
    },

    setup() {
        const movies = ref<Movie[]>([]);
        const currentSlide = ref(0);
        const showOverview = ref<number | undefined>(undefined);
        const userEmail = ref<string | null>(null);
        const friend = ref<User | null>(friendStore?.getters.getUser || null);
        const isMatchDialogVisible = ref(false);

        const compareMovies = async (movie: Movie) => {
            const isInCollection = await CompareMovieToCollection(movie, friend.value?.email!!);
            if (isInCollection) {
                isMatchDialogVisible.value = true; // Show the modal
            }
        }

        const fetchMovies = async () => {
            if (userEmail.value !== null) {
                const apiKey = '70557d73a1b0806815c75df41d2b1874';
                const apiUrl = `https://api.themoviedb.org/3/movie/popular`;
                try {
                    const response = await axios.get(apiUrl, {
                        params: {
                            api_key: apiKey,
                        },
                    });
                    const fetchedMovies = response.data.results;
                    const moviesInCollection = await getMoviesInCollection(userEmail.value);
                    const moviesNotInCollection = fetchedMovies.filter(
                        (movie: Movie) => !isMovieInCollection(moviesInCollection, movie.id));

                    // Set the movies value to the filtered array
                    movies.value = moviesNotInCollection;

                } catch (error) {
                    console.error('Error fetching popular movies:', error);
                }
            }
        };

        const prevSlide = () => {
            currentSlide.value = (currentSlide.value + 1 + movies.value.length) % movies.value.length;
            const movieToRemoveIndex = (currentSlide.value - 1) % movies.value.length;
            movies.value.splice(movieToRemoveIndex, 1);
        };

        const nextSlide = async () => {
            if (userEmail.value !== null) {
                const currentIndex = currentSlide.value;
                currentSlide.value = (currentIndex + 1) % movies.value.length;
                const movieToRemoveIndex = (currentIndex - 1 + movies.value.length) % movies.value.length;
                const movieToAdd = movies.value[currentIndex];
                movies.value.splice(movieToRemoveIndex, 1);
                if (friend !== null) compareMovies(movieToAdd);
                await addMovieToCollection(movieToAdd, 'https://www.themoviedb.org/movie/' + movieToAdd.id, userEmail.value);
            }
        };

        const getImageUrl = (path: string) => {
            return `https://image.tmdb.org/t/p/w500${path}`;
        };

        const toggleOverview = (index: number | undefined) => {
            showOverview.value = index === showOverview.value ? undefined : index;
        };

        onMounted(fetchMovies);

        watch(userEmail, () => {
            fetchMovies();
        });

        // Check the authentication state and set the userEmail value
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                userEmail.value = user.email;
            } else {
                userEmail.value = null;
            }
        });

        return {
            movies,
            currentSlide,
            showOverview,
            prevSlide,
            nextSlide,
            getImageUrl,
            toggleOverview,
            friend,
            isMatchDialogVisible,
        };
    },
};
</script>
  
<style scoped>
.tinder-card {
    background-color: #fff;
    border-radius: 20px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
    margin: 20px auto;
    max-width: 400px;
    overflow: hidden;
    position: relative;
    transition: transform 0.3s ease-in-out;
}

.card-stack .carousel-inner {
    display: flex;
    flex-direction: column-reverse;
}

.carousel-item {
    opacity: 0.5;
    transition: opacity 0.3s;
}

.carousel-item.active {
    opacity: 1;
}

.card-body {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-content {
    flex: 1;
}

.movie-details {
    text-align: center;
}

.movie-poster {
    margin: 10px auto;
    max-width: 200px;
    transition: transform 0.3s ease-in-out;
}

.card-title {
    font-size: 20px;
    margin-bottom: 10px;
}

.overview-row {
    align-items: center;
    display: flex;
    justify-content: center;
    margin-top: 10px;
}

.overview-icon {
    cursor: pointer;
    font-size: 20px;
    margin-right: 10px;
}

.overview-sheet {
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    transform: translateY(100%);
    transition: transform 0.3s ease-in-out;
}

.like-button,
.trash-button {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.like-icon,
.trash-icon {
    font-size: 24px;
    transition: transform 0.3s ease-in-out;
}

.like-button {
    background-color: #E63946;
}

.trash-button {
    background-color: #A8DADC;
}

.card-stack:hover .tinder-card:not(.active) {
    transform: scale(0.9);
}

@media (max-width: 576px) {
    .card-stack {
        max-width: 300px;
    }
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.fireworks {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

.firework {
  width: 20px;
  height: 100px;
  background-color: #ffdd57;
  border-radius: 50%;
  animation: fireworks 1s infinite;
  animation-delay: 0s;
}

.firework1 {
  animation-delay: 0s;
}

.firework2 {
  animation-delay: 0.2s;
}

.firework3 {
  animation-delay: 0.4s;
}

.firework4 {
  animation-delay: 0.6s;
}

.firework5 {
  animation-delay: 0.8s;
}

.firework6 {
  animation-delay: 1s;
}

.firework7 {
  animation-delay: 1.2s;
}

.firework8 {
  animation-delay: 1.4s;
}

.firework9 {
  animation-delay: 1.6s;
}

.firework10 {
  animation-delay: 1.8s;
}

@keyframes fireworks {
  0% {
    transform: scale(0) rotate(0);
  }
  50% {
    transform: scale(1.2) rotate(0);
  }
  100% {
    transform: scale(0) rotate(0);
  }
}
}
</style>