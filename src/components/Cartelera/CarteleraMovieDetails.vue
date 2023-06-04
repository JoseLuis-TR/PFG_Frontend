<template>
  <Loader v-if="isLoading"/>
  <section v-else-if="!isLoading && sessionExists">
    <h2 class="ticketContainer__title">Sesiones</h2>
    <span class="ticketContainer__divider"></span>
    <section class="sliderDetails">
      <button
          class="sliderDetails__sliderButton"
          @click="showPreviousDates">
        <img src="../../assets/icons/left.svg" alt="Atras">
      </button>
      <section
          class="sliderDetails__item"
          v-for="date in visibleDates"
          :key="date.date"
          @click="toggleClass(date.date)"
          v-bind:class="{'selected': date.date === selectedDate}"
          >
        {{date.formattedDate}}
      </section>
      <button
          class="sliderDetails__sliderButton"
          @click="showNextDates">
        <img src="../../assets/icons/right.svg" alt="Siguiente">
      </button>
    </section>
    <section class="infoHorarios">
      <section class="infoHorarios__container" v-if="sessionsList">
        <p class="infoHorarios__container--hora" v-for="sesion in sessionsList[0].sesiones">
          {{sesion.horaSesion}}
        </p>
      </section>
    </section>
  </section>
  <section v-else-if="!isLoading && !sessionExists">
    <VotoPelicula></VotoPelicula>
  </section>
</template>

<script>
  import Loader from '../Loader.vue'
  import VotoPelicula from '../MovieDetails/VotoPelicula.vue';

  export default {
    name: "CarteleraMovieDetails",
    components: { 
      Loader,
      VotoPelicula
    },
    data(){
      return {
        isLoading: true,
        movieSessions: [],
        orderedSessions: {},
        dates: [],
        visibleDates: [],
        sessionsList: [],
        selectedDate: "",
        index: 0,
        sessionExists: true
      }
    },
    watch: {
      selectedDate: function(val){
        this.showHours(val);
      }
    },
    methods: {
      async getMovieInfo(){
        const apiUrl = import.meta.env.VITE_API_URL;

        const response = await fetch(`${apiUrl}/sesiones/desdeHoy/pelicula?idPelicula=${this.$route.params.id}`)
        this.movieSessions = await response.json();
        if(this.movieSessions.hasOwnProperty("codigo")){
          this.sessionExists = false;
        }
      },
      /**
       * Ordena las fechas de las sesiones recibidas en la llamada
       */
      sortDates(){
        let uniqueDates = new Set();

        // Se crea una lista única de fechas de las sesiones
        this.movieSessions.forEach(session => {
          uniqueDates.add(session["fecha"])
        })

        // Se crea un array con las fechas únicas
        this.dates = Array.from(uniqueDates)

        // Se ordenan las fechas
        this.dates.sort(function (a, b) {
          return new Date(a) - new Date(b)
        })
      },
      /**
       * Se crea un nuevo objeto en el que la clave es cada fecha ordenada y como valor un array con las peliculas que se muestran en ese día
       * Se ordenan las peliculas por nombre de la sala y deberemos de crear en cada pelicula un objeto con la clave sesiones y como valor un array con id de sesion y hora
       * @returns {Object} - Objeto con las sesiones ordenadas por fecha
       */
      sortSessionsByDate(){
        let sessionsByDate = {}
        this.dates.forEach(date => {
          sessionsByDate[date] = {};

          // Se filtran las sesiones por fecha 
          sessionsByDate[date] = this.movieSessions
            .filter( session => session["fecha"] === date )
            .reduce((fechaSesionAcumulada, sesion) => {
              if(fechaSesionAcumulada[sesion.peliculaCartelera.id]){
                fechaSesionAcumulada[sesion.peliculaCartelera.id].sesiones.push({id: sesion.id, hora: sesion.hora})
              } else {
                fechaSesionAcumulada[sesion.peliculaCartelera.id] = sesion.peliculaCartelera
                fechaSesionAcumulada[sesion.peliculaCartelera.id].sesiones = [{id: sesion.id, hora: sesion.hora}]
                fechaSesionAcumulada[sesion.peliculaCartelera.id].salaSesion = sesion.salaSesion.nombre;
              }

              fechaSesionAcumulada[sesion.peliculaCartelera.id].sesiones.sort(function (a, b) {
                return a.hora.localeCompare(b.hora)
              })

              return fechaSesionAcumulada;
            }, {})


          sessionsByDate[date] = Object.values(sessionsByDate[date]).map(sesion => ({
            pelicula: sesion,
            salaSesion: sesion.salaSesion,
            sesiones: sesion.sesiones.map(sesion => ({
              idSesion: sesion.id,
              horaSesion: sesion.hora.substring(0,5)
            }))
          }))
        })
        return sessionsByDate
      },
      /**
       * Muestra las 3 anteriores fechas y la siguiente
       */
      showPreviousDates(){
        if(this.index > 0){
          this.index -= 1;
          this.updateVisibleDates();
        }
      },
      /**
       * Muestra las 3 siguientes fechas y la anterior
       */
      showNextDates(){
        if(this.index + 4 < this.dates.length){
          this.index += 1;
          this.updateVisibleDates();
        }
      },
      /**
       * Actualiza las fechas visibles en el slider
       */
      updateVisibleDates(){
        this.visibleDates = []
        // Se obtienen las 4 fechas a mostrar
        const wantedDates = this.dates.slice(this.index, this.index + 4)
        // Se formatean las fechas segun el formato deseado
        wantedDates.forEach(date => {
          let dateString ;
          let dateParts = date.split("-")
          let formattedDate = new Date(dateParts[0], dateParts[1]-1, dateParts[2])
          let today = new Date()
          let tomorrow = new Date(new Date().getTime() + (24 * 60 * 60 * 1000));

          // Se formatea la fecha según el formato deseado
          if(formattedDate.toDateString() === today.toDateString()){
            dateString = "Hoy"
          } else if(formattedDate.toDateString() === tomorrow.toDateString()){
            dateString = "Mañana"
          } else {
            const options = {day: "numeric", month: "2-digit", weekday: "long"};
            dateString = formattedDate.toLocaleDateString("es-ES",options).replace(",","");
          }

          this.visibleDates.push({date:date, formattedDate: dateString})
        })
      },
      /**
       * Muestra las horas de la fecha seleccionada filtrando el array de sesiones por fecha
       * @param {string} date - Fecha seleccionada
       */
        showHours(date) {
        const sessionsList = {};
        for (const key in this.orderedSessions) {
          if (key === date) {
            sessionsList[key] = this.orderedSessions[key];
          }
        }
        this.sessionsList = sessionsList[date];
        console.log(this.sessionsList);
      },
      /**
       * Cambia la fecha seleccionada
       * @param {string} date - Fecha seleccionada
       */
      toggleClass(date){
        this.selectedDate = date;
      },
      /**
       * Convierte la fecha recibida en formato YYYY-MM-DD a DD/MM/YYYY
       */
      formatDate(date){
        let dateParts = date.split("-")
        let formattedDate = new Date(dateParts[0], dateParts[1]-1, dateParts[2])
        const options = {day: "2-digit", month: "2-digit", year: "numeric"};
        return formattedDate.toLocaleDateString("es-ES",options)
      },
    },
    async mounted(){
      this.isLoading = true;
      await this.getMovieInfo();
      if(this.sessionExists){
        this.sortDates();
        this.updateVisibleDates();
        this.orderedSessions = this.sortSessionsByDate();
        this.selectedDate = this.dates[0];
        this.showHours(this.selectedDate);
        this.isLoading = false;
      } else {
        this.isLoading = false;
      }
    }
  }
</script>