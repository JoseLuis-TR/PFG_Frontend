<template>
  <img class="mainDetails__img" :src="movieCapture">
  <section class="containerInfo">
    <section class="containerInfo__poster">
      <img class="containerInfo__poster--img" :src="moviePoster">
    </section>
    <section class="containerInfo__details">
      <h1 class="containerInfo__details--title">{{ movieName }}</h1>
      <p class="containerInfo__details--director">Dirigida por: {{ movieDirector }}</p>
      <p class="containerInfo__details--duration">{{ movieDuration }} minutos</p>
    </section>
  </section>
  <section class="adminButtons">
    <button class="opinions__add deleteMovie" @click="showMovieForm" v-if="user && user.rol === 'ADMIN'">
      <img src="../../assets/icons/trash.svg">
      Eliminar
    </button>
    <button class="opinions__add editMovie" @click="showEditModal" v-if="user && user.rol === 'ADMIN'">
      <img src="../../assets/icons/edit.svg">
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
import ModalNewPelicula from '../NewPelicula/ModalNewPelicula.vue';
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
    showMovieForm() {
      this.showModal = true;
    },
    showEditModal() {
      this.showEditMovie = true;
    },
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