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
                  <img class="seat__img" src="../../assets/icons/seat.svg" alt="Asiento">
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

/**
 * @file BuyTicket.vue - Componente del modal de compra de entradas
 * @author José Luis Tocino Rojo
 * @see <a href="https://github.com/JoseLuis-TR/PFG_Frontend" target="_blank">Github</a>
 * @module Component/Ovelays/BuyTicket
 * 
 * @property {Object} components - Componentes que se utilizan en el componente
 * @property {Object} components.ModalConfirmacion - Componente del modal de confirmación
 * @property {Object} props - Propiedades que recibe el componente
 * @property {Object} props.neededInfo - Información necesaria para la compra de entradas
 * @property {Object} data - Datos del componente
 * @property {Object} data.allSeats - Todos los asientos de la sala
 * @property {Object} data.reservedSeats - Asientos ya reservados de la sesión
 * @property {Object} data.userPickedSeats - Asientos que ha escogido el usuario
 * @property {Object} data.showConfirmation - Booleano que indica si se muestra el modal de confirmación
 * @property {Object} data.precio - Precio de cada entrada
 * @property {Object} data.user - Usuario que está comprando las entradas
 * @property {Object} emits - Eventos que emite el componente
 * @property {Object} emits.close - Evento que emite el componente cuando se cierra
 */
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
  emits: [
    "close"
  ],
  methods: {
    /**
     * Se obtienen los ids e información de todos los asientos de una sala
     */
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
    /**
     * Se obtienen los ids de todos los asientos reservados de una sesión
     */
    async fetchAllReservedSeatsFromSession() {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/sesiones/asientos/${this.neededInfo.idSesion}`)
      const data = await response.json();
      if (data.codigo) return;
      this.reservedSeats = data;
    },
    /**
     * Se escoge un asiento y se añade al array de asientos escogidos, o se elimina si ya estaba escogido
     * @param {Number} seatId - Id del asiento
     */
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
    /**
     * Se compran los asientos escogidos
     */
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
      if (this.$router.currentRoute.value.path === "/") this.$emit("close");
      this.$router.push(`/`);
    }
  },
  async mounted() {
    await this.fetchAllSeatsFromSala();
    await this.fetchAllReservedSeatsFromSession();
  }
}
</script>