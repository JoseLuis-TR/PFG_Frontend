<template>
  <section class="mainDetails">
    <Loader 
      class="loader__details"
      v-if="isLoading"
      :mensajeCarga="'Cargando información de la película'"
      />
    <CaptureBackground
      v-else
      :movieCapture="movieInfo.captura"
      :movieName="movieInfo.nombre"
      :moviePoster="movieInfo.poster"
      :movieDirector="movieInfo.director"
      :movieDuration="movieInfo.duracion"
    />
    <section class="buttons">
      <button
        class="buttons__item"
        :class="{ 'active': infoIsOpen, 'inactive': !infoIsOpen }"
        @click="changeTab('info')">
        Información
      </button>
      <button
        class="buttons__item"
        :class="{ 'active': opinionsIsOpen, 'inactive': !opinionsIsOpen }"
        @click="changeTab('opinions')">
        Opiniones
      </button>
      <button
        class="buttons__item"
        :class="{ 'active': ticketsIsOpen, 'inactive': !ticketsIsOpen }"
        @click="changeTab('tickets')">
        Entradas
      </button>
    </section>
    <infoMovie
      v-if="infoIsOpen"/>
  </section>
</template>

<script>
  import Header from '../components/Header.vue'
  import CaptureBackground from '../components/MovieDetails/CaptureBackground.vue'
  import Loader from '../components/Loader.vue'
  import infoMovie from '../components/MovieDetails/InfoMovie.vue'

  export default {
    name: "MovieDetails",
    components: { 
      Header,
      CaptureBackground,
      Loader,
      infoMovie
    },
    data() {
      return {
        movieInfo: {},
        movieSessions: {},
        isLoading: true,
        infoIsOpen: true,
        opinionsIsOpen: false,
        ticketsIsOpen: false,
      };
    },
    methods: {
      async getMovieDetails(movieId){
        const apiUrl = import.meta.env.VITE_API_URL;
        return await fetch(`${apiUrl}/peliculas?idPelicula=${movieId}`)
            .then(response => response.json())
            .then(data => {
              this.movieInfo = data;
              console.log(this.movieInfo);
              this.isLoading = false;
            });
      },
      async getMovieSessions(movieId){
        const apiUrl = import.meta.env.VITE_API_URL;
        return await fetch(`${apiUrl}/sesiones/desdeHoy/pelicula?idPelicula=${movieId}`)
            .then(response => response.json())
            .then(data => {
              this.movieSessions = data;
              this.orderSessionsByDate();
            });
      },
      // Ordena las sesiones por fecha y almacena dentro de cada objeto fecha
      // las horas de las sesiones de ese día
      orderSessionsByDate(){
        let sessions = this.movieSessions;
        let orderedSessions = [];
        console.log(sessions);
        // Se obtienen las fechas de las sesiones
        // No se modifica el formato de la fecha
        orderedSessions[date] = sessions
        // Se ordenan las sesiones por fecha
        dates.forEach(date => {
          let sessionsByDate = [];
          sessions.forEach(session => {
            let sessionDate = new Date(session.fecha);
            let sessionDateStr = `${sessionDate.getDate()}/${sessionDate.getMonth() + 1}/${sessionDate.getFullYear()}`;
            if(sessionDateStr === date){
              sessionsByDate.push(session);
            }
          });
          orderedSessions.push({date: date, sessions: sessionsByDate});
        });
        console.log(orderedSessions);
        return orderedSessions;
      },
      changeTab(tabName){
      switch(tabName){
        case "info":
          this.infoIsOpen = true;
          this.opinionsIsOpen = false;
          this.ticketsIsOpen = false;
          break;
        case "opinions":
          this.infoIsOpen = false;
          this.opinionsIsOpen = true;
          this.ticketsIsOpen = false;
          break;
        case "tickets":
          this.infoIsOpen = false;
          this.opinionsIsOpen = false;
          this.ticketsIsOpen = true;
          break;
        }
      }
    },
    mounted() {
      this.getMovieDetails(this.$route.params.id);
      this.getMovieSessions(this.$route.params.id);
    }
  };
  
</script>