<template>
  <Loader class="loader__details" v-if="isLoading" :mensajeCarga="'Cargando información de la película'" />
  <section class="mainDetails" v-else>
    <CaptureBackground :movieCapture="movieInfo.captura" :movieName="movieInfo.nombre" :moviePoster="movieInfo.poster"
      :movieDirector="movieInfo.director" :movieDuration="movieInfo.duracion" :movieData="movieInfo" />
    <section class="buttons">
      <button class="buttons__item" :class="{ 'active': activeTab === 'info', 'inactive': activeTab !== 'info' }"
        @click="changeTab('info')">
        Información
      </button>
      <button class="buttons__item" :class="{ 'active': activeTab === 'opinions', 'inactive': activeTab !== 'opinions' }"
        @click="changeTab('opinions')">
        Opiniones
      </button>
      <button class="buttons__item" :class="{ 'active': activeTab === 'tickets', 'inactive': activeTab !== 'tickets' }"
        @click="changeTab('tickets')">
        Entradas
      </button>
    </section>
    <Transition name="fade" mode="out-in">
      <component :is="activeTabComponent"></component>
    </Transition>
  </section>
</template>

<script>
import Header from '../components/Header.vue'
import CaptureBackground from '../components/MovieDetails/CaptureBackground.vue'
import Loader from '../components/Loader.vue'
import infoMovie from '../components/MovieDetails/InfoMovie.vue'
import opinionMovie from '../components/MovieDetails/OpinionMovie.vue';
import ticketMovie from '../components/MovieDetails/TicketMovie.vue';

/**
 * @file MovieDetails.vue - Vista de la página de detalles de una película
 * @author José Luis Tocino Rojo
 * @see <a href="https://github.com/JoseLuis-TR/PFG_Frontend" target="_blank">Github</a>
 * @module View/MovieDetails
 * 
 * @property {Object} components - Componentes que se usan dentro de la vista
 * @property {Object} components.Header - Componente del header
 * @property {Object} components.CaptureBackground - Componente de la parte superior de la página con poster, captura e info
 * @property {Object} components.Loader - Componente del loader
 * @property {Object} components.infoMovie - Componente de la información de la película (sinopsis y trailer)
 * @property {Object} components.opinionMovie - Componente de las opiniones de la película
 * @property {Object} components.ticketMovie - Componente de las entradas de la película
 * @property {Object} data - Datos del componente
 * @property {Object} data.movieInfo - Información de la película a mostrar
 * @property {Object} data.movieSessions - Sesiones de la película a mostrar
 * @property {Boolean} data.isLoading - Indica si se está cargando lo que se quiere ver
 * @property {Boolean} data.infoIsOpen - Indica si el componente de información está abierto
 * @property {Boolean} data.opinionsIsOpen - Indica si el componente de opiniones está abierto
 * @property {Boolean} data.ticketsIsOpen - Indica si el componente de entradas está abierto
 * @property {String} data.activeTab - Indica el componente que está abierto
 * @property {Array} data.sessions - Sesiones de la película a mostrar
 */
export default {
  name: "MovieDetails",
  components: {
    Header,
    CaptureBackground,
    Loader,
    infoMovie,
    opinionMovie,
    ticketMovie
  },
  data() {
    return {
      movieInfo: {},
      movieSessions: {},
      isLoading: true,
      infoIsOpen: true,
      opinionsIsOpen: false,
      ticketsIsOpen: false,
      activeTab: 'info',
      sessions: [],
    };
  },
  methods: {
    /**
     * Obtiene la información de la pelicula
     * 
     * @param {Number} movieId - Id de la película
     * @returns {Object} - Información de la película
     */
    async getMovieDetails(movieId) {
      const apiUrl = import.meta.env.VITE_API_URL;
      return await fetch(`${apiUrl}/peliculas?idPelicula=${movieId}`)
        .then(response => response.json())
        .then(data => {
          this.movieInfo = data;
          this.isLoading = false;
        });
    },
    /**
     * Ordena las sesiones por fecha y almacena dentro de cada objeto fecha
     * las horas de las sesiones de ese día
     * 
     * @returns {Array} - Sesiones ordenadas por fecha
     */
    orderSessionsByDate() {
      let sessions = this.movieSessions;
      let orderedSessions = [];
      // Se obtienen las fechas de las sesiones
      // No se modifica el formato de la fecha
      orderedSessions[date] = sessions
      // Se ordenan las sesiones por fecha
      dates.forEach(date => {
        let sessionsByDate = [];
        sessions.forEach(session => {
          let sessionDate = new Date(session.fecha);
          let sessionDateStr = `${sessionDate.getDate()}/${sessionDate.getMonth() + 1}/${sessionDate.getFullYear()}`;
          if (sessionDateStr === date) {
            sessionsByDate.push(session);
          }
        });
        orderedSessions.push({ date: date, sessions: sessionsByDate });
      });
      return orderedSessions;
    },
    changeTab(tabName) {
      this.activeTab = tabName;
    }
  },
  computed: {
    /**
     * Comprueba que tab es la que se quiere abrir para mostrarlo
     */
    activeTabComponent() {
      switch (this.activeTab) {
        case "info":
          return 'infoMovie';
        case "opinions":
          return 'opinionMovie';
        case "tickets":
          return 'ticketMovie';
        default:
          return 'infoMovie';
      }
    }
  },
  mounted() {
    /**
     * Se obtiene la información de la película usando el id de la ruta
     */
    this.getMovieDetails(this.$route.params.id);
  }
};

</script>