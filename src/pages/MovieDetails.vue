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
    async getMovieDetails(movieId) {
      const apiUrl = import.meta.env.VITE_API_URL;
      return await fetch(`${apiUrl}/peliculas?idPelicula=${movieId}`)
        .then(response => response.json())
        .then(data => {
          this.movieInfo = data;
          this.isLoading = false;
        });
    },
    // Ordena las sesiones por fecha y almacena dentro de cada objeto fecha
    // las horas de las sesiones de ese día
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
    this.getMovieDetails(this.$route.params.id);
  }
};

</script>