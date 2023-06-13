<template>
  <Loader v-if="isLoading" />
  <section v-else-if="!isLoading && sessionsList.length > 0" class="sliderSinceToday">
    <button class="sliderSinceToday__sliderButton" @click="showPreviousDates">
      <img src="../../assets/icons/left.svg" alt="Atras">
    </button>
    <section class="sliderSinceToday__item" v-for="date in visibleDates" @click="toggleClass(date.date)"
      v-bind:class="{ 'selected': date.date === selectedDate }">
      {{ date.formattedDate }}
    </section>
    <button class="sliderSinceToday__sliderButton" @click="showNextDates">
      <img src="../../assets/icons/right.svg" alt="Siguiente">
    </button>
  </section>
  <section v-if="!isLoading && sessionsList.length > 0" class="infoMovies">
    <section class="infoMovies__item" v-for="movieSession in sessionsList">
      <section class="infoMovies__item__data">
        <img class="infoMovies__item__data--poster" :src="movieSession.pelicula.poster" alt="Poster pelicula"
          @click="seeMovieDetails(movieSession.pelicula.id)">
        <p class="infoMovies__item__data--titulo" @click="seeMovieDetails(movieSession.pelicula.id)">
          {{ movieSession.pelicula.nombre }}
        </p>
        <p class="infoMovies__item__data--sala">{{ movieSession.salaSesion.nombre }}</p>
      </section>
      <section class="infoMovies__item__times">
        <p @click="showBuyTicketsModal(sesion.idSesion, movieSession.pelicula.nombre, movieSession.salaSesion.id, sesion.horaSesion)"
          class="infoMovies__item__times--hour" v-for="sesion in movieSession.sesiones">
          {{ sesion.horaSesion }}
        </p>
      </section>
    </section>
  </section>
  <ErrorComp v-if="!isLoading && sessionsList.length === 0" mensajeError="No hay sesiones programadas proximamente" />
  <BuyTicket v-if="showBuyTicket" :neededInfo="buyTicketNeededInfo" @close="showBuyTicket = false">
  </BuyTicket>
</template>

<script>
/**
 * @file Cartelera.vue - Componente que contiene la cartelera de las próximas sesiones
 * @author José Luis Tocino Rojo
 * @see <a href="https://github.com/JoseLuis-TR/cines_haven" target="_blank">Github</a>
 * @module Component/Cartelera/CarteleraGeneral
 * 
 * @property {Object} components - Componentes que se utilizan en la cartelera
 * @property {Object} components.Loader - Componente pantalla de carga
 * @property {Object} components.ErrorComp - Componente de error por si no hay sesiones
 * @property {Object} components.BuyTicket - Componente del modal de compra de entradas
 * @property {Object} data - Variables del componente
 * @property {Array} data.sinceToday - Array con las sesiones desde hoy
 * @property {Array} data.dates - Array con las fechas de las sesiones
 * @property {Array} data.visibleDates - Array con las fechas visibles en el slider
 * @property {number} data.index - Índice de la fecha seleccionada
 * @property {string} data.selectedDate - Fecha seleccionada
 * @property {Array} data.sessionsList - Array con las sesiones de la fecha seleccionada
 * @property {boolean} data.orderedSessions - Objeto con las sesiones ordenadas por fecha y sala
 * @property {boolean} data.isLoading - Indica si se está cargando la cartelera
 * @property {boolean} data.showBuyTicket - Indica si se muestra el modal de compra
 * @property {Object} data.buyTicketNeededInfo - Objeto con la información necesaria para comprar la entrada
 * @property {string} data.buyTicketNeededInfo.idSesion - Id de la sesión
 * @property {string} data.buyTicketNeededInfo.idSala - Id de la sala
 * @property {string} data.buyTicketNeededInfo.movieName - Nombre de la película
 * @property {string} data.buyTicketNeededInfo.pickedTime - Hora de la sesión escogida
 */
import Loader from '../Loader.vue'
import ErrorComp from '../Error.vue'
import BuyTicket from '../Overlays/BuyTicket.vue';

export default {
  name: "Cartelera",
  components: { Loader, ErrorComp, BuyTicket },
  data() {
    return {
      sinceToday: [],
      dates: [],
      visibleDates: [],
      index: 0,
      selectedDate: "",
      sessionsList: [],
      orderedSessions: {},
      isLoading: false,
      showBuyTicket: false,
      buyTicketNeededInfo: {
        idSesion: "",
        idSala: "",
        movieName: "",
        pickedTime: "",
      }
    }
  },
  /** 
   * Se detecta cuando cambia la fecha seleccionada y se muestran las horas de 
   * la fecha seleccionada
   */
  watch: {
    selectedDate: function (val) {
      this.showHours(val)
    }
  },
  methods: {
    /**
     * Llamada a la api para obtener todas las sesiones desde el día de hoy
     * @returns {Promise} - Promesa con las sesiones desde hoy
     */
    async getSinceTodaySessions() {
      const apiUrl = import.meta.env.VITE_API_URL;
      return await fetch(`${apiUrl}/sesiones/desdeHoy`)
        .then(response => response.json())
        .then(data => {
          this.sinceToday = data
          this.isLoading = false
        })
    },
    /**
     * Ordena las fechas de las sesiones que se han obtenido desde hoy
     * desde la más cercana a la más lejana
     */
    sortDates() {
      let uniqueDates = new Set();

      // Se crea una lista única de fechas de las sesiones
      this.sinceToday.forEach(session => {
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
     * Al hacer click en el botón izquierda del slider se muestra una fecha
     * más cercana a la actual
     */
    showPreviousDates() {
      if (this.index > 0) {
        this.index -= 1;
        this.updateVisibleDates();
      }
    },
    /**
     * Al hacer click en el botón derecha del slider se muestra una fecha
     * más lejana a la actual
     */
    showNextDates() {
      if (this.index + 4 < this.dates.length) {
        this.index += 1;
        this.updateVisibleDates();
      }
    },
    /**
     * Actualiza las fechas visibles en el slider
     */
    updateVisibleDates() {
      this.visibleDates = []
      // Se obtienen las 4 fechas a mostrar
      const wantedDates = this.dates.slice(this.index, this.index + 4)
      // Se formatean las fechas segun el formato deseado
      wantedDates.forEach(date => {
        let dateString;
        let dateParts = date.split("-")
        let formattedDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
        let today = new Date()
        let tomorrow = new Date(new Date().getTime() + (24 * 60 * 60 * 1000));

        // Se formatea la fecha según el formato deseado
        if (formattedDate.toDateString() === today.toDateString()) {
          dateString = "Hoy"
        } else if (formattedDate.toDateString() === tomorrow.toDateString()) {
          dateString = "Mañana"
        } else {
          const options = { day: "numeric", month: "2-digit", weekday: "long" };
          dateString = formattedDate.toLocaleDateString("es-ES", options).replace(",", "");
        }

        this.visibleDates.push({ date: date, formattedDate: dateString })
      })
    },
    /**
     * Muestra las horas de la fecha seleccionada filtrando el array de sesiones por fecha
     * @param {string} date - Fecha seleccionada
     */
    showHours(date) {
      this.sessionsList = Object.fromEntries(
        Object.entries(this.orderedSessions)
          .filter(([key, value]) => key === date)
      )

      this.sessionsList = this.sessionsList[date]
    },
    /**
     * Cambia la fecha seleccionada
     * @param {string} date - Fecha seleccionada
     */
    toggleClass(date) {
      this.selectedDate = date;
    },
    /**
     * Redirige a la página de la película seleccionada
     * @param {number} movieID - ID de la película seleccionada
     */
    seeMovieDetails(movieID) {
      this.$router.push(`pelicula/${movieID}`)
    },
    /**
     * Se crea un nuevo objeto en el que la clave es cada fecha ordenada y como valor un array con las peliculas que se muestran en ese día
     * Se ordenan las peliculas por nombre de la sala y deberemos de crear en cada pelicula un objeto con la clave sesiones y como valor un array con id de sesion y hora
     * @returns {Object} - Objeto con las sesiones ordenadas por fecha
     */
    sortSessionsByDate() {
      let sessionsByDate = {}
      this.dates.forEach(date => {
        sessionsByDate[date] = {};

        // Se filtran las sesiones por fecha 
        sessionsByDate[date] = this.sinceToday
          .filter(session => session["fecha"] === date)
          .reduce((fechaSesionAcumulada, sesion) => {
            if (fechaSesionAcumulada[sesion.peliculaCartelera.id]) {
              fechaSesionAcumulada[sesion.peliculaCartelera.id].sesiones.push({ id: sesion.id, hora: sesion.hora })
            } else {
              fechaSesionAcumulada[sesion.peliculaCartelera.id] = sesion.peliculaCartelera
              fechaSesionAcumulada[sesion.peliculaCartelera.id].sesiones = [{ id: sesion.id, hora: sesion.hora }]
              fechaSesionAcumulada[sesion.peliculaCartelera.id].salaSesion = sesion.salaSesion;
            }

            fechaSesionAcumulada[sesion.peliculaCartelera.id].sesiones.sort(function (a, b) {
              return a.hora.localeCompare(b.hora)
            })

            return fechaSesionAcumulada;
          }, {})

        // Se crea un array de fechas con los datos de la pelicula y sus sesiones
        sessionsByDate[date] = Object.values(sessionsByDate[date]).map(sesion => ({
          pelicula: sesion,
          salaSesion: sesion.salaSesion,
          sesiones: sesion.sesiones.map(sesion => ({
            idSesion: sesion.id,
            horaSesion: sesion.hora.substring(0, 5)
          }))
        }))

        // Se ordenan las sesiones de un dia por el nombre de la sala
        sessionsByDate[date].sort(function (a, b) {
          return a.salaSesion.nombre.localeCompare(b.salaSesion.nombre);
        });
      })
      return sessionsByDate
    },
    /**
     * Funcion que llama al modal para la compra de entradas
     * @param {string} idSesion - Id de la sesion seleccionada
     * @param {string} movieName - Nombre de la pelicula
     * @param {string} idSala - Id de la sala de la sesion seleccionada
     */
    showBuyTicketsModal(idSesion, movieName, idSala, pickedTime) {
      this.buyTicketNeededInfo = {
        idSesion: idSesion,
        movieName: movieName,
        idSala: idSala,
        pickedTime: pickedTime
      };
      this.showBuyTicket = true;
    },
  },
  // Cuando se monta el componente se hace la llamada a la api, se ordenan las fechas y se muestran
  // las horas de la primera fecha
  async mounted() {
    this.isLoading = true
    await this.getSinceTodaySessions()
    this.sortDates()
    this.updateVisibleDates()
    this.orderedSessions = this.sortSessionsByDate()
    this.selectedDate = this.dates[0]
  }
}
</script>
