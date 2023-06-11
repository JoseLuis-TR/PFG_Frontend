<template>
  <section class="top">
    <h2 class="top__titulo">Top 5 + esperadas</h2>
    <section class="top__container">
      <Loader mensajeCarga="Cargando Top 5" v-if="isLoading" />
      <ul class="list" v-else-if="!isLoading && topMovies.length > 0">
        <li class="list__item" v-for="(movie, index) in this.topMovies.slice(0, 5)">
          <p class="list__item__order">{{ index + 1 }}</p>
          <section class="list__item__info">
            <p class="list__item__info__name" @click="redirectToMoviePage(movie.id)">{{ movie.nombre }}</p>
            <p class="list__item__info__vote">{{ movie.votos }} votos</p>
          </section>
        </li>
      </ul>
      <ErrorComp v-else-if="!isLoading && topMovies.length === 0" mensajeError="No hay películas en el top" />
    </section>
  </section>
</template>

<script>
/**
 * @file TopEsperadas.vue - Componente que contiene el top 5 de películas más esperadas por los usuarios
 * @author José Luis Tocino Rojo
 * @see <a href="https://github.com/JoseLuis-TR/cines_haven" target="_blank">Github</a>
 */

/**
 * @property {string} name - Nombre del componente
 * @property {Object} components - Componentes que se utilizan en la página
 * @property {Object} components.Loader - Componente loader de la página
 * @vue-data {Array} topMovies - Array que contiene las películas más esperadas
 * @vue-data {boolean} isLoading - Booleano que indica si se está cargando la página
 */
import Loader from './Loader.vue';
import ErrorComp from './Error.vue';

export default {
  name: "TopEsperadas",
  components: { Loader, ErrorComp },
  data() {
    return {
      topMovies: [],
      isLoading: false
    };
  },
  methods: {
    /**
     * Obtiene las películas más votadas por los usuarios
     */
    async getTopMovies() {
      const apiUrl = import.meta.env.VITE_API_URL;
      return await fetch(`${apiUrl}/peliculas/top`)
        .then(response => response.json())
        .then(data => {
          this.topMovies = data;
          this.isLoading = false;
        });
    },
    /**
     * Redirige a la página de la película
     * @param {number} movieId - Id de la película
     */
    redirectToMoviePage(movieId) {
      this.$router.push(`pelicula/${movieId}`)
    }
  },
  mounted() {
    this.isLoading = true;
    this.getTopMovies();
  }
}
</script>