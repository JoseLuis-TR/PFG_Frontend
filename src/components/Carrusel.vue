<template>
    <section class="carteleraHoy">
        <h2 class="carteleraHoy__titulo">Hoy en cartelera</h2>
        <Loader mensajeCarga="Cargando cartelera" v-if="isLoading"/>
        <Splide
            :options="slideOptions"
            class="carteleraHoy__splide"
            v-else-if="!isLoading && this.moviesUnicas.length > 0">
            <SplideSlide 
                class="carteleraHoy__splide__slide"
                v-for="(movie, index) in this.moviesUnicas"
                :key="index"
                @click="redirectToMoviePage(movie.peliculaCartelera.id)">
                    <img :src="movie.peliculaCartelera.captura" >
                    <section class="movieInfo">
                        <p class="movieInfo__titulo">{{movie.peliculaCartelera.nombre}}</p>
                    </section>
            </SplideSlide>
        </Splide>
        <section v-else>
            <p>No hay películas en cartelera</p>
        </section>
    </section>
</template>

<script>
  /**
   * @file Carrusel.vue - Componente que contiene el carrusel de las películas en cartelera hoy
   * @see <a href="https://github.com/JoseLuis-TR/PFG_Frontend - target="_blank">Github</a>
   */

  /**
   * @property {string} name - Nombre del componente
   * @property {Object} components - Componentes que se utilizan en el carrusel
   * @property {Object} components.Loader - Componente pantalla de carga
   * @property {Object} components.Splide - Componente carrusel de la libreria de Splide
   * @vue-data {Array} movies - Array con las películas que se muestran en el carrusel
   * @vue-data {boolean} [isLoading = false] - Indica si se está cargando el carrusel
   * @vue-data {Object} slideOptions - Opciones para personalizar el carrusel
   * @vue-data {string} slideOptions.type - Tipo de carrusel
   * @vue-data {boolean} slideOptions.arrows - Indica si se muestran las flechas de navegación
   * @vue-data {boolean} slideOptions.cover - La imagen ocupa todo el espacio del carrusel
   * @vue-data {boolean} slideOptions.autoplay - Indica si el carrusel se mueve automáticamente
   * @vue-data {number} slideOptions.interval - Intervalo de tiempo entre cada movimiento del carrusel
   */

  import { Splide } from '@splidejs/vue-splide';
  import Loader from './Loader.vue';

  export default{
      name: "Carrusel",
      components: { Splide, Loader },
      data() {
          return {
              movies: [],
              movieListForCarousel: [],
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
                    const moviesArray = this.movies.map(proxy => proxy)
                    this.moviesUnicas = moviesArray.filter((movie, indice, array) => {
                        return array.findIndex(obj => obj.peliculaCartelera.id === movie.peliculaCartelera.id) === indice;
                    });
                    console.log(this.moviesUnicas)
                    this.isLoading = false;
                });
            },
            /**
           * Redirecciona a la página de la película
           */
          redirectToMoviePage(movieId) {
              console.log(movieId)
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
