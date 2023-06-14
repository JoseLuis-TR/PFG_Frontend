<template>
  <Transition name="modalBG">
    <section class="modalContainer" @click.self="$emit('close')">
      <Transition name="fade" appear mode="out-in">
        <section class="modal modalSesion">
          <section class="modalSesion__pickDate" v-if="!showPickHours">
            <p class="modalSesion__pickDate__title">Selecciona una fecha</p>
            <input class="modalSesion__pickDate__input" v-model="pickedDate" type="date" :min="today"
              v-on:change="checkAvalaibleDate">
          </section>
          <section class="modalSesion__error"
            v-if="pickedDate !== null && avalaibleSalas !== null && avalaibleSalas.length === 0 && !showPickHours">
            <p class="modalSesion__error__text">No se pueden añadir más sesiones para la fecha seleccionada</p>
          </section>
          <section class="modalSesion__pickMovie"
            v-if="pickedDate !== null && (avalaibleSalas !== null && avalaibleSalas.length > 0) && !showPickHours">
            <p class="modalSesion__pickMovie__title">Seleccione una película</p>
            <select class="modalSesion__pickMovie__input" v-model="selectedMovie" v-on:change="checkMovie">
              <option v-for="movie in allMovies" :value="movie">
                {{ movie.nombre }}
              </option>
            </select>
          </section>
          <section class="modalSesion__pickSala" v-if="selectedMovie !== null && !showPickHours">
            <p class="modalSesion__pickSala__title">Seleccione una sala</p>
            <select class="modalSesion__pickSala__input" v-model="selectedSala" v-on:change="checkMovie">
              <option v-for="sala in avalaibleSalas" :value="sala">
                {{ sala.nombre }}
              </option>
            </select>
          </section>
          <section v-if="pickedDate && selectedMovie && selectedSala && !showPickHours">
            <button class="pickHourbtn" @click="showPickHours = true">
              Elegir horarios
            </button>
          </section>
          <PickHours v-if="showPickHours" :selectedSesionDate="pickedDate" :selectedSesionMovie="selectedMovie"
            :selectedSesionSala="selectedSala">
          </PickHours>
        </section>
      </Transition>
      <Transition name="fade" appear mode="out-in" @sessionAdded="$emit('close')">
      </Transition>
    </section>
  </Transition>
</template>

<script>

/**
 * @file AddSession.vue - Modal para añadir una sesión
 * @author José Luis Tocino Rojo
 * @see <a href="https://github.com/JoseLuis-TR/PFG_Frontend" target="_blank">Github</a>
 * @module Component/Overlays/AddSession
 * 
 * @property {Object} data - Datos del componente
 * @property {Object} data.today - Fecha de hoy
 * @property {Object} data.pickedSessions - Sesiones que ya existen y no pueden ser sobreescritas
 * @property {Object} data.allSalas - Todas las salas
 * @property {Object} data.avalaibleSalas - Salas disponibles para la fecha seleccionada
 * @property {Object} data.pickedDate - Fecha seleccionada
 * @property {Object} data.allMovies - Todas las películas
 * @property {Object} data.selectedMovie - Película seleccionada
 * @property {Object} data.selectedSala - Sala seleccionada
 * @property {Object} data.showPickHours - Mostrar el componente para seleccionar horas de la sesión
 * @property {Object} emits - Eventos que emite el componente
 * @property {Object} emits.close - Cierra el modal
 * @property {Object} components - Componentes que se utilizan en la página
 * @property {Object} components.PickHours - Componente para seleccionar horas de la sesión
 */
import PickHours from "./PickHours.vue";
export default {
  name: "AddSession",
  data() {
    return {
      today: this.whatDayIsToday(),
      pickedSessions: null,
      allSalas: null,
      avalaibleSalas: null,
      pickedDate: null,
      allMovies: null,
      selectedMovie: null,
      selectedSala: null,
      showPickHours: false
    }
  },
  emits: ['close'],
  components: {
    PickHours
  },
  methods: {
    /**
     * Función que obtiene el día que es hoy para poder establecerlo como mínimo en el input de fecha
     * @returns {String} Fecha de hoy
     */
    whatDayIsToday() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    },
    /**
     * Función que obtiene todas las sesiones desde hoy que existen en la base de datos
     * @returns {Object} Todas las sesiones
     */
    async getSinceTodaySessions() {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/sesiones/desdeHoy`);
      const data = await response.json();
      return data;
    },
    /**
     * Función que obtiene todas las salas que existen en la base de datos
     * @returns {Object} Todas las salas
     */
    async getAllSalas() {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/salas`);
      const data = await response.json();
      return data;
    },
    /**
     * Función que obtiene todas las películas que existen en la base de datos
     * @returns {Object} Todas las películas
     */
    async getAllMovies() {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/peliculasMini`);
      const data = await response.json();
      if (data.codigo) {
        return [];
      }
      return data;
    },
    /**
     * Función que comprueba si en la fecha seleccionada hay sesiones disponibles
     */
    async checkAvalaibleDate() {
      const sessionsForPickedDate = [];
      if (this.pickedSessions && !this.pickedSessions.codigo) {
        this.pickedSessions.filter(session => session.fecha === this.pickedDate);
      }

      this.avalaibleSalas = this.allSalas.filter(sala => {
        return !sessionsForPickedDate.some(session => session.salaSesion.id === sala.id);
      });

      if (this.avalaibleSalas.length === 0) {
        this.selectedMovie = null;
        this.selectedSala = null;
      }
    }
  },
  async mounted() {
    this.pickedSessions = await this.getSinceTodaySessions();
    this.allSalas = await this.getAllSalas();
    this.allMovies = await this.getAllMovies();
  }
}
</script>