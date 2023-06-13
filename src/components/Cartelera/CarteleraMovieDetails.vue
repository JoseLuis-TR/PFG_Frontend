<template>
  <Loader v-if="isLoading" />
  <section v-else-if="!isLoading && sessionExists">
    <h2 class="ticketContainer__title">Sesiones</h2>
    <span class="ticketContainer__divider"></span>
    <section class="sliderDetails">
      <button class="sliderDetails__sliderButton" @click="showPreviousDates">
        <img src="../../assets/icons/left.svg" alt="Atras">
      </button>
      <section class="sliderDetails__item" v-for="date in visibleDates" :key="date.date" @click="toggleClass(date.date)"
        v-bind:class="{ 'selected': date.date === selectedDate }">
        {{ date.formattedDate }}
      </section>
      <button class="sliderDetails__sliderButton" @click="showNextDates">
        <img src="../../assets/icons/right.svg" alt="Siguiente">
      </button>
    </section>
    <section class="infoHorarios">
      <section class="infoHorarios__container" v-if="sessionsList">
        <p @click="showBuyTicketsModal(sesion.idSesion, sessionsList[0].pelicula.nombre, sessionsList[0].salaSesion.id, sesion.horaSesion)"
          class="infoHorarios__container--hora" v-for="sesion in sessionsList[0].sesiones">
          {{ sesion.horaSesion }}
        </p>
      </section>
    </section>
  </section>
  <section v-else-if="!isLoading && !sessionExists">
    <VotoPelicula></VotoPelicula>
  </section>
  <BuyTicket v-if="showBuyTicket" :neededInfo="buyTicketNeededInfo" @close="showBuyTicket = false">
  </BuyTicket>
</template>

<script>
import Loader from '../Loader.vue'
import VotoPelicula from '../MovieDetails/VotoPelicula.vue';
import BuyTicket from '../Overlays/BuyTicket.vue';

/**
 * @file CarteleraMovieDetails.vue - Página principal de la aplicación
 * @author José Luis Tocino Rojo
 * @see <a href="https://github.com/JoseLuis-TR/PFG_Frontend" target="_blank">Github</a>
 * @module Component/Cartelera/CarteleraPelicula
 * 
 * @property {Object} components - Componentes que se utilizan en la página
 * @property {Object} components.Loader - Componente Loader
 * @property {Object} components.VotoPelicula - Componente para el voto de las peliculas sin sesiones
 * @property {Object} components.BuyTicket - Componente para la compra de entradas
 * @property {Object} data - Datos de la página
 * @property {boolean} data.isLoading - Indica si se está cargando la página
 * @property {Object[]} data.movieSessions - Sesiones de la película
 * @property {Object} data.orderedSessions - Sesiones ordenadas por fecha
 * @property {string[]} data.dates - Fechas de las sesiones
 * @property {string[]} data.visibleDates - Fechas visibles en el slider
 * @property {Object[]} data.sessionsList - Sesiones de la fecha seleccionada
 * @property {string} data.selectedDate - Fecha seleccionada
 * @property {number} data.index - Índice de la fecha seleccionada
 * @property {boolean} data.sessionExists - Indica si la película tiene sesiones
 * @property {boolean} data.showAddSession - Indica si se muestra el modal para añadir sesiones
 * @property {boolean} data.showBuyTicket - Indica si se muestra el modal para comprar entradas
 * @property {Object} data.buyTicketNeededInfo - Información necesaria para comprar entradas
 * @property {string} data.buyTicketNeededInfo.idSesion - Id de la sesión
 * @property {string} data.buyTicketNeededInfo.idSala - Id de la sala
 * @property {string} data.buyTicketNeededInfo.movieName - Nombre de la película
 * @property {string} data.buyTicketNeededInfo.pickedTime - Hora de la sesión
 */
export default {
  name: "CarteleraMovieDetails",
  components: {
    Loader,
    VotoPelicula,
    BuyTicket
  },
  data() {
    return {
      isLoading: true,
      movieSessions: [],
      orderedSessions: {},
      dates: [],
      visibleDates: [],
      sessionsList: [],
      selectedDate: "",
      index: 0,
      sessionExists: true,
      showAddSession: false,
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
   * Revisa la fecha que se señala para mostrar las horas de ese día
   */
  watch: {
    selectedDate: function (val) {
      this.showHours(val);
    }
  },
  methods: {
    /**
     * Recoge las sesiones desde hoy de la pelicula en especifico
     * 
     * @returns {Promise} - Sesiones de la película
     */
    async getMovieInfo() {
      const apiUrl = import.meta.env.VITE_API_URL;

      const response = await fetch(`${apiUrl}/sesiones/desdeHoy/pelicula?idPelicula=${this.$route.params.id}`)
      this.movieSessions = await response.json();
      if (this.movieSessions.hasOwnProperty("codigo")) {
        this.sessionExists = false;
      }
    },
    /**
     * Ordena las fechas de las sesiones recibidas en la llamada
     */
    sortDates() {
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
    sortSessionsByDate() {
      let sessionsByDate = {}
      this.dates.forEach(date => {
        sessionsByDate[date] = {};

        // Se filtran las sesiones por fecha 
        sessionsByDate[date] = this.movieSessions
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


        sessionsByDate[date] = Object.values(sessionsByDate[date]).map(sesion => ({
          pelicula: sesion,
          salaSesion: sesion.salaSesion,
          sesiones: sesion.sesiones.map(sesion => ({
            idSesion: sesion.id,
            horaSesion: sesion.hora.substring(0, 5)
          }))
        }))
      })
      return sessionsByDate
    },
    /**
     * Muestra una fecha más cercana a la actualidad al hacer click en el botón
     * de la izquierda en el slider
     */
    showPreviousDates() {
      if (this.index > 0) {
        this.index -= 1;
        this.updateVisibleDates();
      }
    },
    /**
     * Muestra una fecha más lejana a la actualidad al hacer click en el botón
     * que se encuentra a la derecha en el slider
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
      const sessionsList = {};
      for (const key in this.orderedSessions) {
        if (key === date) {
          sessionsList[key] = this.orderedSessions[key];
        }
      }
      this.sessionsList = sessionsList[date];
    },
    /**
     * Cambia la fecha seleccionada
     * @param {string} date - Fecha seleccionada
     */
    toggleClass(date) {
      this.selectedDate = date;
    },
    /**
     * Convierte la fecha recibida en formato YYYY-MM-DD a DD/MM/YYYY
     * 
     * @param {string} date - Fecha en formato YYYY-MM-DD
     */
    formatDate(date) {
      let dateParts = date.split("-")
      let formattedDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
      const options = { day: "2-digit", month: "2-digit", year: "numeric" };
      return formattedDate.toLocaleDateString("es-ES", options)
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
  async mounted() {
    // Realiza la carga de las sesiones de la pelicula y ordena las fechas
    // En caso de no existir sesiones muestra el componente para votar
    this.isLoading = true;
    await this.getMovieInfo();
    if (this.sessionExists) {
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