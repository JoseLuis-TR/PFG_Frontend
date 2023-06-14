<template>
  <img class="mainDetails__img" :alt="`Captura de la pelicula ${movieName}`" :src="movieCapture">
  <section class="containerInfo">
    <section class="containerInfo__poster">
      <img class="containerInfo__poster--img" :alt="`Poster de la película ${movieName}`" :src="moviePoster">
    </section>
    <section class="containerInfo__details">
      <h1 class="containerInfo__details--title">{{ movieName }}</h1>
      <p class="containerInfo__details--director">Dirigida por: {{ movieDirector }}</p>
      <p class="containerInfo__details--duration">{{ movieDuration }} minutos</p>
    </section>
  </section>
  <section class="adminButtons">
    <button class="opinions__add deleteMovie" @click="showMovieForm" v-if="user && user.rol === 'ADMIN'">
      <img src="../../assets/icons/trash.svg" alt="Icono de eliminar">
      Eliminar
    </button>
    <button class="opinions__add editMovie" @click="showEditModal" v-if="user && user.rol === 'ADMIN'">
      <img src="../../assets/icons/edit.svg" alt="Icono de editar">
      Editar
    </button>
  </section>
  <ModalConfirmacion v-if="showModal" @close="showModal = false" @delete="deleteMovie"
    :mensaje="'¿Esta seguro de querer eliminar esta pelicula?'"></ModalConfirmacion>
  <ModalNewPelicula v-if="showEditMovie" @close="showEditMovie = false" :action="'edit'" :toEdit="movieData">
  </ModalNewPelicula>
</template>

<script>
import { getLoggedUser } from '../../store/user';
import ModalConfirmacion from '../Overlays/ModalConfirmacion.vue';
import ModalNewPelicula from '../Overlays/ModalNewPelicula.vue';

/**
 * @file CaptureBackground.vue - Vista de la cabecera de la página de detalles de una película.
 * @author José Luis Tocino Rojo
 * @see <a href="https://github.com/JoseLuis-TR/PFG_Frontend" target="_blank">Github</a>
 * @module Component/MovieDetails/CaptureBackground
 * 
 * @property {Object} props - Propiedades que recibe el componente al iniciarse
 * @property {string} props.movieCapture - Imagen de fondo de la cabecera
 * @property {string} props.movieName - Nombre de la película
 * @property {string} props.moviePoster - Imagen del poster de la película
 * @property {string} props.movieDirector - Director de la película
 * @property {string} props.movieDuration - Duración de la película
 * @property {Object} props.movieData - Datos de la película para poder hacer la edicion
 * @property {Object} components - Componentes que usa el componente
 * @property {Object} components.ModalConfirmacion - Componente de confirmación de eliminación de película
 * @property {Object} components.ModalNewPelicula - Componente de formulario de edición de película
 * @property {Object} data - Datos del componente
 * @property {Object} data.user - Usuario logueado
 * @property {boolean} data.showModal - Muestra el modal de confirmación de eliminación
 * @property {boolean} data.showEditMovie - Muestra el modal de edición de película
 */
export default {
  name: "CaptureBackground",
  props: [
    "movieCapture",
    "movieName",
    "moviePoster",
    "movieDirector",
    "movieDuration",
    "movieData"
  ],
  components: {
    ModalConfirmacion,
    ModalNewPelicula
  },
  data() {
    return {
      user: getLoggedUser(),
      showModal: false,
      showEditMovie: false
    }
  },
  methods: {
    /**
     * Muestra el modal de confirmación de eliminación de película
     */
    showMovieForm() {
      this.showModal = true;
    },
    /**
     * Muestra el modal de edición de película
     */
    showEditModal() {
      this.showEditMovie = true;
    },
    /**
     * Elimina la película de la base de datos
     */
    deleteMovie() {
      const apiUrl = import.meta.env.VITE_API_URL;
      const movieId = this.$route.params.id;

      const options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }


      fetch(`${apiUrl}/delPelicula/${movieId}`, options)
        .then(response => response.json())
        .then(data => {
          if (data.id) {
            this.$router.push('/');
          }
        })
        .catch(error => console.log(error));
    }
  }
}
</script>