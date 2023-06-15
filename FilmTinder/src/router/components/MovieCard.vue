<template>
    <div class="movie-card" @swipeleft="reject" @swiperight="accept">
      <img :src="movie.poster_path" alt="Movie Poster">
      <div class="movie-info">
        <h3 class="movie-title">{{ movie.title }}</h3>
        <p class="movie-overview">{{ movie.overview }}</p>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { Movie } from '../BackEnd/Interfaces';
  
  export default defineComponent({
    name: 'MovieCard',
    props: {
      movie: {
        type: Object as () => Movie,
        required: true,
      },
      onReject: {
        type: Function,
        required: true,
      },
      onAccept: {
        type: Function,
        required: true,
      },
    },
    methods: {
      reject() {
        this.onReject(this.movie);
      },
      accept() {
        this.onAccept(this.movie);
      },
    },
  });
  </script>
  
  <style scoped>
  .movie-card {
    position: relative;
    width: 300px;
    height: 400px;
    background-color: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .movie-info {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 10px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    font-size: 16px;
    text-align: center;
  }
  
  .movie-title {
    margin-bottom: 5px;
  }
  
  .movie-overview {
    margin-bottom: 0;
  }
  </style>
  