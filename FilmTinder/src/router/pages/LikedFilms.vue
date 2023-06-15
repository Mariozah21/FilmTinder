<template>
  <h3 v-if="friend">You are comparing with: {{ $route.params.friendName }}</h3>
  <v-container fluid>
    <v-row dense>
      <template v-if="movies.length === 0">
        <v-col cols="12">
          <div class="text-center">
            <h3>You don't like any films right now.</h3>
          </div>
        </v-col>
      </template>
      <template v-else>
        
        <v-col v-for="film in movies" :key="film.title" cols="4">
          <v-card class="pa-4 film-card" elevation="10">
            <v-list class="film-list">
              <v-list-item :key="film.id" class="py-3">
                
                <v-list-item-avatar>
                  <v-img :src="getImageUrl(film.poster_path)" class="elevation-2" style="max-width: 100px;"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="text-h6 mb-1 text-center d-fle align-items-center justify-content-center">{{ film.title }}</v-list-item-title>
                  <v-list-item-subtitle class="mb-2">{{ film.overview }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn small @click="deleteFilm(film)" class="ma-0 button">
                    Delete
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ref } from 'vue';
import { Movie , User } from '../BackEnd/Interfaces';
import { getMoviesInCollection, deleteMovieFromCollection, CompareMovieToCollection } from '../BackEnd/components';
import { getAuth } from "firebase/auth";
import friendStore from '@/stores/friendStore';

export default {
  data() {
    return {
      movies: ref<Movie[]>([]),
      userEmail: null as string | null,
      friend: ref<User | null>(friendStore?.getters.getUser || null),
    };
  },

  async mounted() {
    await this.getUserEmail();
    await this.fetchFilms();
    if(this.friend !== null) this.compareMovies();
  },

  methods: {
    async fetchFilms() {
      try {
        this.movies = await getMoviesInCollection(this.userEmail || ''); 
      } catch (error) {
        console.error('Error fetching films', error);
      }
    },

    async deleteFilm(film: Movie) {
      // Delete film from the array
      const index = this.movies.findIndex((m) => m.id === film.id);
      if (index !== -1) {
        this.movies.splice(index, 1);
      }

      try {
        // Delete film from the database
        await deleteMovieFromCollection(film.id, this.userEmail || '');
      } catch (error) {
        console.error('Error deleting film', error);
      }
    },

    async getUserEmail() {
      const user = getAuth().currentUser;
      this.userEmail = user?.email || null;
    },
    getImageUrl(path: string) {
      return `https://image.tmdb.org/t/p/w500${path}`;
    },

    
    compareMovies(){
      const filteredMovies = ref<Movie[]>([]) // vytvorim si docasnu premennu
      if(this.friend !== null){ 
          for (const movie of Object.values(this.movies)){
            CompareMovieToCollection(movie, this.friend.email) //tato funkcia porovna jeden film s celou kolekciou a ak sa ten fil nachadza v kolekcii toho usera ktoreho email tam je dany tak to vrati true inak false
        .then(result => {
          if (result == true) {
            filteredMovies.value.push(movie)
          } else {
            // Not a match
          }
        })
        .catch(error => {
          console.error('Error comparing movie:', error);
        });

          }
          this.movies = filteredMovies.value
      }
    },
  
  },
};
</script>

<style scoped>
.film-list {
  padding: 0;
}

.film-list .v-list-item {
  border-bottom: 1px solid #ccc;
  transition: background-color 0.3s;
}

.film-list .v-list-item:last-child {
  border-bottom: none;
}

.film-list .v-list-item:hover {
  background-color: #f5f5f5;
}

.film-list .v-list-item .v-list-item-avatar {
  border-radius: 50%;
  overflow: hidden;
}

.film-list .v-list-item .v-list-item-action {
  align-self: center;
}

.film-list .v-list-item .v-list-item-action .v-btn {
  margin-top: 0;
  margin-bottom: 0;
}

.film-list .v-list-item .v-list-item-content .v-list-item-title {
  font-size: 18px;
  font-weight: bold;
}

.film-list .v-list-item .v-list-item-content .v-list-item-subtitle {
  color: #777;
}

.film-card {
  background-color: #fafafa;
  border-radius: 8px;
  transition: transform 0.3s;
}

.film-card:hover {
  transform: scale(1.02);
}

.fab-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 999;
}

@media (max-width: 576px) {
  .fab-button {
    bottom: 10px;
    right: 10px;
  }
}
</style>
