<template>
  <v-container>
    <v-row class="search-bar-row">
      <v-col cols="12" class="search-bar-col">
        <div class="search-bar-container">
          <v-text-field v-model="searchTerm" placeholder="Search movies" class="search-bar search-input"></v-text-field>
          <v-btn @click="searchMovies" class="button pb-20 ma-4 button">Search</v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row class="movie-row">
      <v-col cols="12" sm="6" md="4" v-for="movie in movies" :key="movie.id" class="mb-3">
        <v-card class="movie-item" elevation="10">
          <v-img :src="getImageUrl(movie.poster_path)" alt="Movie poster" class="movie-poster"></v-img>
          <v-card-text>
            <div class="movie-title">{{ movie.title }}</div>
            <v-row class="movie-buttons-row">
              <v-col cols="6">
                <v-btn class="button" @click="isLiked(movie.id) ? unlikeMovie(movie) : likeMovie(movie)">
                  <v-icon :color="isLiked(movie.id) ? 'red' : ''">{{ isLiked(movie.id) ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn class="button" @click="toggleOverview(movie.id)">
                  <v-icon>{{ showOverview === movie.id ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <div v-if="showOverview === movie.id" class="pa-8">{{ movie.overview }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { getFirestore, collection, doc, setDoc, addDoc, getDoc } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import firebaseApp from '@/config';
import '@/assets/main.css';
import { Movie } from '../BackEnd/Interfaces';
import { addMovieToCollection, deleteMovieFromCollection ,getMoviesInCollection} from '../BackEnd/components';


const apiKey = '70557d73a1b0806815c75df41d2b1874';
const baseUrl = 'https://api.themoviedb.org/3';
const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MDU1N2Q3M2ExYjA4MDY4MTVjNzVkZjQxZDJiMTg3NCIsInN1YiI6IjY0NTRmZjVjODdhMjdhMDE3MjNkNTg3NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ScGJftf0X06cSuOGKeg-yFRXoucdoLQogF5ev7b6q_o';

const showOverview = ref<number | false>(false);
const movies = ref<Movie[]>([]);
const searchTerm = ref('');
const db = getFirestore(firebaseApp);
const userEmail = getAuth().currentUser?.email;
const likedMovies = ref<number[]>([]);


const toggleOverview = (id: number) => {
  showOverview.value = showOverview.value === id ? false : id;
};

const fetchLikedMovies = async () => {
      const movies = await getMoviesInCollection(userEmail!!);
      likedMovies.value = movies.map((movie) => movie.id);
    };
fetchLikedMovies()

const likeMovie = async (movie: Movie) => {
  addMovieToCollection(movie, 'https://www.themoviedb.org/movie/' + movie.id, userEmail!!)
  toggleHeart(movie.id)
}

const unlikeMovie = async (movie: Movie) => {
  deleteMovieFromCollection(movie.id, userEmail!!)
  toggleHeart(movie.id)
}

const searchMovies = async () => {
  try {
    const response = await axios.get(`${baseUrl}/search/movie`, {
      params: {
        api_key: apiKey,
        query: searchTerm.value
      },
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json;charset=utf-8'
      }
    });

    movies.value = response.data.results;
  } catch (error) {
    console.error('Error searching for movies:', error);
  }
};


const isLiked = (id: number) => {
  return likedMovies.value.includes(id);
};

const toggleHeart = (id: number) => {
  if (isLiked(id)) {
    likedMovies.value = likedMovies.value.filter(movieId => movieId !== id);
  } else {
    likedMovies.value.push(id);
  }
};

const getImageUrl = (path: string) => {
  return `https://image.tmdb.org/t/p/w500${path}`;
};
</script>

<style scoped>
@import '@/assets/main.css';


.search-bar-row {
  display: flex;
  justify-content: center;
}

.search-bar-col {
  display: flex;
  justify-content: center;
}

.search-bar-container {
  display: flex;
  align-items: center;
}

.search-input {
  width: 750px;
  /* Adjust the width as needed */
}
.movie-row {
  justify-content: center;
}

.movie-item {
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  transition: transform 0.3s;
  border-radius: 8px;

}

.movie-item:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.movie-poster {
  width: 100%;
  height: 300px;
  object-fit: cover;
  margin: 10px;
  border-radius: 8px 8px 0 0;
}

.movie-buttons-row {
  margin-top: 10px;
}

.movie-title {
  margin-bottom: 10px;
  font-weight: bold;
}
.movie-item:hover .movie-overview {
  height: 80px;
}
</style>
