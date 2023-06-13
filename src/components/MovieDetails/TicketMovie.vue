<template>
  <section class="ticketContainer" v-if="true">
    <CarteleraMovieDetails />
  </section>
</template>

<script>
import CarteleraMovieDetails from '../Cartelera/CarteleraMovieDetails.vue';

/**
 * @file TicketMovie.vue - Componente sin mucha utilidad
 * @author José Luis Tocino Rojo
 * @see <a href="https://github.com/JoseLuis-TR/PFG_Frontend" target="_blank">Github</a>
 * @module Component/MovieDetails/TicketMovie
 * 
 * @property {Object} components - Componentes que se utilizan en la página
 * @property {Object} components.CarteleraMovieDetails - Componente que muestra los detalles de una película
 * @property {Object} props - Propiedades que recibe el componente
 * @property {Object} props.sessions - Sesiones de la película
 */
export default {
  name: "ticketMovie",
  components: { CarteleraMovieDetails },
  props: [
    "sessions"
  ]
}
</script>
