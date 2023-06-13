<template>
  <section class="vote">
    <p class="vote__title">¡Oh no!</p>
    <p class="vote__explain">
      Actualmente no hay programadas nuevas sesiones para esta pelicula, pero puedes votar para que vuelva a cartelera.
      <br>
      <br>
      Contra más votos... ¡más posibilidades de que vuelva!
    </p>
    <button class="vote__button" @click="castVote" v-if="!isVoted">
      <img src="../../assets/icons/like.svg" alt="like">
      Votar
    </button>
    <Transition name="fade">
      <p class="vote__voted" v-if="isVoted">
        ¡Gracias por tu voto! <br>
        Votos actuales: {{ movieData.votos }}
      </p>
    </Transition>
  </section>
</template>

<script>
import { getLoggedUser } from '../../store/user';

/**
 * @file VotoPelicula.vue - Vista para votar una película y que vuelva a cartelera
 * @author José Luis Tocino Rojo
 * @see <a href="https://github.com/JoseLuis-TR/PFG_Frontend" target="_blank">Github</a>
 * @module Component/MovieDetails/VotoPelicula
 * 
 * @property {Object} data - Los datos que maneja el componente
 * @property {string} data.movieData - Datos de la película
 * @property {boolean} data.isVoted - Indica si el usuario ha votado
 * @property {Object} data.user - Usuario logueado
 */
export default {
  name: "VotoPelicula",
  data() {
    return {
      movieData: {},
      isVoted: false,
      user: getLoggedUser()
    }
  },
  methods: {
    /**
     * Se envia el voto realizado a la API
     */
    async castVote() {
      const apiUrl = import.meta.env.VITE_API_URL;
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const response = await fetch(`${apiUrl}/peliculas/voto?idPelicula=${this.$route.params.id}`, options);
      this.movieData = await response.json();
      this.isVoted = true;
    }
  },
}
</script>