<template>
  <Transition name="modalBG">
    <section class="modalContainer" @click.self="$emit('close')">
      <Transition name="modal" appear>
        <article class="formContainer newBuyer">
          <p class="newBuyer__title">Escoge los asientos</p>
          <section class="chooseSeat">
            <div class="chooseSeat__row" v-for="(fila, key) in allSeats">
              <p class="chooseSeat__row__title">{{ key }}</p>
              <div class="chooseSeat__row__columns">
                <div class="seat" v-for="seat in fila" :class="[
                    reservedSeats.includes(seat.id) ? 'disabled' : 'available',
                    userPickedSeats.includes(seat.id) ? 'picked' : ''
                  ]" @click="pickSeat(seat.id)">
                  <p class="seat__number">{{ seat.numero }}</p>
                  <img class="seat__img" src="../../assets/icons/seat.svg" alt="seat">
                </div>
              </div>
            </div>
          </section>
          <button v-if="userPickedSeats.length > 0" class="newBuyer__button" @click="showConfirmation = true">
            Comprar entradas
          </button>
        </article>
      </Transition>
    </section>
  </Transition>
  <ModalConfirmacion v-if="showConfirmation" @close="showConfirmation = false" @delete="buyReservedSeats"
    :mensaje="`¿Estás seguro de que quieres comprar ${userPickedSeats.length} entradas por un total de ${userPickedSeats.length * precio} euros?`" />
</template>

<script>
import ModalConfirmacion from './ModalConfirmacion.vue';
import { getLoggedUser } from '../../store/user';
export default {
  name: "BuyTicket",
  props: [
    "neededInfo"
  ],
  components: {
    ModalConfirmacion
  },
  data() {
    return {
      allSeats: {},
      reservedSeats: [],
      userPickedSeats: [],
      showConfirmation: false,
      precio: 5,
      user: getLoggedUser()
    }
  },
  methods: {
    async fetchAllSeatsFromSala() {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/asientos/sala/${this.neededInfo.idSala}`)
      const data = await response.json();
      data.forEach((objectSeat) => {
        const fila = objectSeat.fila;
        if (!this.allSeats.hasOwnProperty(fila)) {
          this.allSeats[fila] = [];
        }
        this.allSeats[fila].push(objectSeat);
      })
    },
    async fetchAllReservedSeatsFromSession() {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/sesiones/asientos/${this.neededInfo.idSesion}`)
      const data = await response.json();
      if (data.codigo) return;
      this.reservedSeats = data;
    },
    pickSeat(seatId) {
      if (this.reservedSeats.length > 0 && this.reservedSeats.includes(seatId)) {
        return;
      }
      if (this.userPickedSeats.includes(seatId)) {
        this.userPickedSeats = this.userPickedSeats.filter((seat) => seat !== seatId);
      } else {
        this.userPickedSeats.push(seatId);
      }
    },
    async buyReservedSeats() {
      const apiUrl = import.meta.env.VITE_API_URL;
      if (this.user) {
        this.neededInfo.id_usuario = this.user.id;
      }
      const response = await fetch(`${apiUrl}/reservas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id_usuario: this.neededInfo.id_usuario ? this.neededInfo.id_usuario : null,
          id_sesion: this.neededInfo.idSesion,
          asientos: this.userPickedSeats
        })
      })
      const data = await response.json();
      if (this.$router.currentRoute.value.path === "/") this.$emit("close");
      this.$router.push(`/`);
    }
  },
  async mounted() {
    console.log(this.neededInfo);
    await this.fetchAllSeatsFromSala();
    await this.fetchAllReservedSeatsFromSession();
  }
}
</script>