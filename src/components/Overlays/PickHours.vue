<template>
  <section class="modalSesion__pickHours">
    <p class="modalSesion__pickHours__title">Selecciona las horas para las sesiones</p>
    <section v-for="(input, index) in hourList" :key="`hora - ${index}`" class="modalSesion__pickHours__group">
      <input class="modalSesion__pickHours__group--input" @blur="isValidHour(index, input.hour)"
        :class="{ 'error': showError[index] }" type="time" v-model="input.hour">
      <section class="inputButtons">
        <img v-if="hourList.length >= 0 && hourList.length < 5" @click="addHour" class="inputButtons__add"
          src="../../assets/icons/add.svg">
        <img v-if="hourList.length > 1" @click="deleteHour(index)" class="inputButtons__delete"
          src="../../assets/icons/cross.svg">
      </section>
    </section>
    <Transition name="errorMessage">
      <section v-show="errorMessage !== null" class="formContainer__body__form--error">
        <ul class="list">
          <li class="item">{{ errorMessage }}</li>
        </ul>
      </section>
    </Transition>
    <button v-if="hourListValid" @click="addNewSesion">
      Agregar sesión
    </button>
  </section>
</template>

<script>
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
    hourList: {
      handler: function () {
        this.checkNotEmptyNotRepeat();
      },
      deep: true,
      inmediate: true
    },
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
    addHour() {
      if (this.errorMessage !== null) {
        return;
      }
      this.hourList.push({ hour: null });
      console.log(this.selectedSesionMovie)
    },
    deleteHour(index) {
      this.hourList.splice(index, 1);
    },
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
    verifyOverlapingHours() {
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
          console.log(realIndex)
          return {
            ...hour,
            realIndex
          }
        });

      console.log(sortedHourList)
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