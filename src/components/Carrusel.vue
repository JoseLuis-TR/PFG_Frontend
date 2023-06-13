<template>
  <section class="carteleraHoy">
    <h2 class="carteleraHoy__titulo">Hoy en cartelera</h2>
    <Loader mensajeCarga="Cargando cartelera" v-if="isLoading" />
    <Splide :options="slideOptions" class="carteleraHoy__splide" v-else-if="!isLoading && this.movies">
      <SplideSlide class="carteleraHoy__splide__slide" v-for="(movie, index) in this.moviesUnicas" :key="index"
        @click="redirectToMoviePage(movie.peliculaCartelera.id)">
        <img :src="movie.peliculaCartelera.captura">
        <section class="movieInfo">
          <p class="movieInfo__titulo">{{ movie.peliculaCartelera.nombre }}</p>
        </section>
      </SplideSlide>
    </Splide>
    <ErrorComp v-else mensajeError="No hay peliculas programadas para hoy" />
  </section>
</template>

<script>
/**
 * @file Carrusel.vue - Componente que contiene el carrusel de las películas en cartelera hoy
 * @author José Luis Tocino Rojo
 * @see <a href="https://github.com/JoseLuis-TR/PFG_Frontend" target="_blank">Github</a>
 * @module Component/Carrusel
 * 
 * @property {Object} components - Componentes que se utilizan en el carrusel
 * @property {Object} components.Loader - Componente pantalla de carga
 * @property {Object} components.Splide - Componente carrusel de la libreria de Splide
 * @property {Object} components.ErrorComp - Componente pantalla de error
 * @property {Object} data - Datos del componente
 * @property {Array} data.movies - Array que contiene las películas hoy en cartelera
 * @property {boolean} data.isLoading - Booleano que indica si se está cargando la página
 * @property {Object} data.slideOptions - Opciones del carrusel
 * @property {string} data.slideOptions.type - Tipo de carrusel
 * @property {boolean} data.slideOptions.arrows - Indica si se muestran las flechas
 * @property {boolean} data.slideOptions.cover - Indica si se muestra la imagen completa
 * @property {boolean} data.slideOptions.autoplay - Indica si se reproduce automáticamente
 * @property {number} data.slideOptions.interval - Intervalo de tiempo entre cada slide
 * @property {Array} data.moviesUnicas - Array que contiene las películas hoy en cartelera sin repetir
 * 
 */

import { Splide } from '@splidejs/vue-splide';
import Loader from './Loader.vue';
import ErrorComp from './Error.vue';

export default {
  name: "Carrusel",
  components: { Splide, Loader, ErrorComp },
  data() {
    return {
      movies: [],
      isLoading: false,
      slideOptions: {
        type: 'loop',
        arrows: false,
        cover: true,
        autoplay: true,
        interval: 3000
      },
      moviesUnicas: []
    };
  },
  methods: {
    /**
     * Obtiene las películas en cartelera hoy
     * @returns {Promise} - Promesa con las películas en cartelera hoy
     */
    async getTodaySessions() {
      const apiUrl = import.meta.env.VITE_API_URL;
      return await fetch(`${apiUrl}/sesiones/hoy`)
        .then(response => response.json())
        .then(data => {
          this.movies = data;
          if (this.movies.codigo === 404) {
            this.movies = false;
            this.isLoading = false;
            return;
          }
          const moviesArray = this.movies.map(proxy => proxy)
          this.moviesUnicas = moviesArray.filter((movie, indice, array) => {
            return array.findIndex(obj => obj.peliculaCartelera.id === movie.peliculaCartelera.id) === indice;
          });
          this.isLoading = false;
        });
    },
    /**
     * Redirecciona a la página de la película
     */
    redirectToMoviePage(movieId) {
      this.$router.push(`pelicula/${movieId}`)
    }
  },
  // Se obtienen las películas en cartelera al montar el componente
  mounted() {
    this.isLoading = true;
    this.getTodaySessions();
  }
}
</script>
