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
import { getLoggedUser } from '../store/user';
import ModalNewPelicula from '../components/Overlays/ModalNewPelicula.vue';
import ErrorComp from '../components/Error.vue';

/**
 * @file Catalogo.vue - Vista del catalogo de peliculas de la aplicación
 * @author José Luis Tocino Rojo
 * @see <a href="https://github.com/JoseLuis-TR/PFG_Frontend" target="_blank">Github</a>
 * @module View/Catalogo
 * 
 * @property {Object} data - Datos del componente
 * @property {Array} data.moviesList - Lista de peliculas
 * @property {Number} data.currentPage - Página actual
 * @property {Object} data.user - Usuario logueado
 * @property {Boolean} data.showAddMovie - Indica si se muestra el formulario de añadir pelicula
 * @property {Object} components - Componentes usados en la vista
 * @property {Object} components.ModalNewPelicula - Componente del formulario de añadir pelicula
 * @property {Object} components.ErrorComp - Componente de catalogo vacio
 */
export default {
  name: "Catalogo",
  data() {
    return {
      moviesList: [],
      currentPage: 1,
      user: getLoggedUser(),
      showAddMovie: false,
    }
  },
  components: {
    ModalNewPelicula,
    ErrorComp
  },
  methods: {
    /**
     * Recibe los datos de las peliculas que se encuentra en la vista páginada que devuelve
     * el backend
     * 
     * @param {Number} page - Página a buscar
     * @returns {Promise} - Promesa con los datos de las peliculas
     */
    async getMoviesByPage(page) {
      const apiUrl = import.meta.env.VITE_API_URL;
      return await fetch(`${apiUrl}/peliculas/page?numberPage=${page}`)
        .then(response => response.json())
        .then(data => {
          this.moviesList = data;
        });
    },
    /**
     * Mueve la vista a los detalles de la pelicula seleccionada
     * 
     * @param {Number} movieId - Id de la pelicula
     */
    seeMovieDetails(movieId) {
      this.$router.push(`/pelicula/${movieId}`);
    },
    /**
     * Muestra el formulario para añadir una pelicula
     */
    showMovieForm() {
      this.showAddMovie = true;
    },
    /**
     * Oculta el formulario para añadir una pelicula
     */
    hideForm() {
      this.showAddMovie = false;
    }
  },
  /**
   * Se revisa en que página esta la vista al crear la vista, usando la primera página
   * en caso de no existir ninguna en los parametros de ruta.
   * Después hace la busqueda de las peliculas de la página correspondiente
   */
  mounted() {
    this.currentPage = parseInt(this.$route.query.page) || 1;
    this.getMoviesByPage(this.currentPage - 1);
  },
  /**
   * Revisa los cambios que realice la paginación en currentPage para moverse a la ruta
   * correspondiente.
   * Tras el cambio de ruta se hace la llamada a la api
   */
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