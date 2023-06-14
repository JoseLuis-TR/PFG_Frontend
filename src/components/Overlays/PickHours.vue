<template>
  <section class="modalSesion__pickHours">
    <p class="modalSesion__pickHours__title">Selecciona las horas para las sesiones</p>
    <section v-for="(input, index) in hourList" :key="`hora - ${index}`" class="modalSesion__pickHours__group">
      <input class="modalSesion__pickHours__group--input" @blur="isValidHour(index, input.hour)"
        :class="{ 'error': showError[index] }" type="time" v-model="input.hour">
      <section class="inputButtons">
        <img v-if="hourList.length >= 0 && hourList.length < 5" @click="addHour" class="inputButtons__add"
          src="../../assets/icons/add.svg" alt="Icono de añadir">
        <img v-if="hourList.length > 1" @click="deleteHour(index)" class="inputButtons__delete"
          src="../../assets/icons/cross.svg" alt="Icono de eliminar">
      </section>
    </section>
    <Transition name="errorMessage">
      <section v-show="errorMessage !== null" class="formContainer__body__form--error">
        <ul class="list">
          <li class="item">{{ errorMessage }}</li>
        </ul>
      </section>
    </Transition>
    <button class="pickHourbtn" v-if="hourListValid" @click="addNewSesion">
      Agregar sesión
    </button>
  </section>
</template>

<script>

/**
 * @file PickHours.vue - Componente usado en la creación de sesiones para escoger las horas
 * @author José Luis Tocino Rojo
 * @see <a href="https://github.com/JoseLuis-TR/PFG_Frontend" target="_blank">Github</a>
 * @module Component/Overlays/PickHours
 * 
 * @property {Object} props - Propiedades que recibe el componente
 * @property {Object} props.selectedSesionDate - Fecha de la sesión seleccionada
 * @property {Object} props.selectedSesionMovie - Película de la sesión seleccionada
 * @property {Object} props.selectedSesionSala - Sala de la sesión seleccionada
 * @property {Object} data - Datos del componente
 * @property {Array} data.hourList - Lista de horas seleccionadas
 * @property {Boolean} data.hourListValid - Indica si la lista de horas es válida
 * @property {Array} data.noNullList - Lista de horas sin valores nulos
 * @property {Array} data.showError - Lista de errores
 * @property {String} data.errorMessage - Mensaje de error
 */
export default {
  name: "PickHours",
  props: [
    "selectedSesionDate",
    "selectedSesionMovie",
    "selectedSesionSala"
  ],
  data() {
    return {
      hourList: [{ hour: null }],
      hourListValid: false,
      noNullList: [],
      showError: [],
      errorMessage: null
    }
  },
  watch: {
    /**
     * Comprueba los cambios en el listado de horas para revisar si es válido
     */
    hourList: {
      handler: function () {
        this.checkNotEmptyNotRepeat();
      },
      deep: true,
      inmediate: true
    },
    /**
     * Comprueba el cambio en el mensaje de error para revisar si el formulario es válido
     */
    errorMessage: {
      handler: function () {
        if (this.errorMessage === null) {
          this.hourListValid = true;
        } else {
          this.hourListValid = false;
        }
      },
      deep: true,
      inmediate: true
    }
  },
  methods: {
    /**
     * Añade una hora a la lista de horas
     */
    addHour() {
      if (this.errorMessage !== null) {
        return;
      }
      this.hourList.push({ hour: null });
    },
    /**
     * Elimina una hora de la lista de horas
     * @param {Number} index - Índice de la hora a eliminar
     */
    deleteHour(index) {
      this.hourList.splice(index, 1);
    },
    /**
     * Comprueba que la lista de horas no esté vacía y que no haya horas que se pisen
     */
    isValidHour(index, hour) {
      if (this.errorMessage !== null) {
        this.verifyOverlapingHours();
        if (this.errorMessage !== null) {
          return;
        }
      }
      if (hour === null || hour === "") {
        this.errorMessage = "No puedes dejar horas vacias"
        this.showError[index] = true;
      } else {
        this.errorMessage = null;
        this.showError[index] = false;
        if (this.hourList.length > 1) {
          this.verifyOverlapingHours();
        }
      };
    },
    /**
     * Se encarga de revisar que no haya horas que se pisen entre sí
     * Se entiende por pisarse entre sí aquellas horas que se repitan o no respeten la duración
     * de la película + el tiempo necesario para la limpieza de la sala (20 minutos)
     */
    verifyOverlapingHours() {
      // Para mayor facilidad de cálculo, se ordenan las horas de menor a mayor
      const sortedHourList = this.hourList
        .slice()
        .filter(hour => hour.hour !== '' && hour.hour !== null)
        .sort((a, b) => {
          const fechaA = new Date();
          fechaA.setHours(parseInt(a.hour.split(":")[0]));
          fechaA.setMinutes(parseInt(a.hour.split(":")[1]));

          const fechaB = new Date();
          fechaB.setHours(parseInt(b.hour.split(":")[0]));
          fechaB.setMinutes(parseInt(b.hour.split(":")[1]));

          return fechaA - fechaB;
        })
        .map((hour, index) => {
          const realIndex = this.hourList.indexOf(hour);
          return {
            ...hour,
            realIndex
          }
        });

      // Se crea un set para almacenar las horas que se pisan entre sí
      let overlapingHours = new Set();
      sortedHourList.forEach((currentHour, index) => {
        if (index < sortedHourList.length - 1) {
          const hourA = currentHour.hour;
          const hourB = sortedHourList[index + 1].hour;

          const fechaA = new Date();
          fechaA.setHours(parseInt(hourA.split(":")[0]));
          fechaA.setMinutes(parseInt(hourA.split(":")[1]));

          const fechaB = new Date();
          fechaB.setHours(parseInt(hourB.split(":")[0]));
          fechaB.setMinutes(parseInt(hourB.split(":")[1]));

          const minutesDifference = Math.abs(fechaB - fechaA) / (1000 * 60);

          if (minutesDifference < this.selectedSesionMovie.duracion + 20) {
            overlapingHours.add(currentHour.realIndex);
            overlapingHours.add(sortedHourList[index + 1].realIndex);
          } else {
            this.errorMessage = null;
            this.showError[currentHour.realIndex] = false;
            this.showError[sortedHourList[index + 1].realIndex] = false;
          }
        }
      });
      // Si hay horas que se pisan entre sí, se muestra un mensaje de error
      if (overlapingHours.size > 0) {
        this.errorMessage = `Ten en cuenta la duración en minutos de la pelicula (${this.selectedSesionMovie.duracion} minutos) más el tiempo de limpieza (20 minutos)`;
        this.hourListValid = false;
        overlapingHours.forEach(indexHour => {
          this.showError[indexHour] = true;
        })
      } else {
        this.errorMessage = null;
      }
    },
    /**
     * Se encarga de comprobar que el input de la hora no esté vacío y que no se repitan las horas
     */
    checkNotEmptyNotRepeat() {
      if (this.errorMessage !== null) {
        return;
      }
      const notNull = this.hourList.filter(hour => hour.hour !== null && hour.hour !== "");
      this.noNullList = notNull;
      if (this.noNullList.length === 0) {
        this.hourListValid = false;
        this.errorMessage = "Debes seleccionar al menos una hora";
        return;
      } else {
        this.hourListValid = true;
        this.errorMessage = null;
      }
      const uniqueHours = [...new Set(this.noNullList.map(hour => hour.hour))];
      const repeatError = uniqueHours.length !== this.noNullList.length;
      if (repeatError) {
        this.errorMessage = "No puedes repetir horas";
        return;
      } else {
        this.errorMessage = null;
        this.showError = [];
      }
    },
    /**
     * Se encarga de añadir las horas a la sesión y enviarla al servidor
     */
    async addNewSesion() {
      const hourListString = this.hourList.map(hour => hour.hour).join(", ");
      const apiUrl = import.meta.env.VITE_API_URL;

      const newSesion = {
        fecha: this.selectedSesionDate,
        horas: hourListString,
        id_pelicula: this.selectedSesionMovie.id,
        id_sala: this.selectedSesionSala.id
      }

      await fetch(`${apiUrl}/sesiones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newSesion)
      })

      this.$router.go();
    }
  }
}
</script>