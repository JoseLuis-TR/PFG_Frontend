<template>
  <section class="catalogoContainer">
    <h2 class="catalogoContainer__titulo">Catálogo</h2>
    <button class="opinions__add" @click="showMovieForm" v-if="user && user.rol === 'ADMIN'">
      <img src="../assets/icons/add.svg">
      Añade una pelicula
    </button>
    <ul class="catalogoContainer__lista" v-if="moviesList.peliculas">
      <li class="catalogoContainer__lista__item" v-for="movie in moviesList.peliculas">
        <div class="catalogoContainer__lista__item__container" @click="seeMovieDetails(movie.id)">
          <img class="catalogoContainer__lista__item__container--img" :src="movie.poster">
          <p class="catalogoContainer__lista__item__container--titulo">
            {{ movie.nombre }}
          </p>
        </div>
      </li>
    </ul>
    <v-pagination v-if="moviesList.peliculas" :length="moviesList.totalPages" :total-visible="10" v-model="currentPage"
      prev-icon="ai-triangle-left-fill" next-icon="ai-triangle-right-fill"></v-pagination>
    <ErrorComp v-else mensajeError="El catálogo se encuentra actualmente vacio"></ErrorComp>
  </section>
  <ModalNewPelicula v-if="showAddMovie" @close="hideForm" :action="add"></ModalNewPelicula>
</template>

<script>
import CustomPrevIcon from '../assets/icons/left.svg';
import CustomNextIcon from '../assets/icons/right.svg';
import { getLoggedUser } from '../store/user';
import ModalNewPelicula from '../components/NewPelicula/ModalNewPelicula.vue';
import ErrorComp from '../components/Error.vue';
export default {
  name: "Catalogo",
  data() {
    return {
      moviesList: [],
      page: 0,
      currentPage: 1,
      prevIcon: CustomPrevIcon,
      nextIcon: CustomNextIcon,
      user: getLoggedUser(),
      showAddMovie: false,
    }
  },
  components: {
    ModalNewPelicula,
    ErrorComp
  },
  methods: {
    async getMoviesByPage(page) {
      const apiUrl = import.meta.env.VITE_API_URL;
      return await fetch(`${apiUrl}/peliculas/page?numberPage=${page}`)
        .then(response => response.json())
        .then(data => {
          this.moviesList = data;
        });
    },
    seeMovieDetails(movieId) {
      this.$router.push(`/pelicula/${movieId}`);
    },
    showMovieForm() {
      this.showAddMovie = true;
    },
    hideForm() {
      this.showAddMovie = false;
    }
  },
  mounted() {
    this.currentPage = parseInt(this.$route.query.page) || 1;
    this.getMoviesByPage(this.currentPage - 1);
  },
  watch: {
    currentPage: function (val) {
      this.$router.push('/catalogo?page=' + val);
    },
    $route() {
      this.currentPage = parseInt(this.$route.query.page) || 1;
      this.getMoviesByPage(this.currentPage - 1);
    }
  }
}
</script>