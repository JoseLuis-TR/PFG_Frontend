<template>
  <section>
    <Loader v-if="isLoading"></Loader>
    <section class="opinions" v-else-if="!isLoading && opinions.length > 0">
      <button class="opinions__add" @click="showForm" v-if="user">
        <img src="../../assets/icons/add.svg">
        Añade una opinión
      </button>
      <section class="opinions__container">
        <article class="opinions__container--item" v-for="opinion in opinions">
          <section class="user">
            <img class="user__img" v-if="opinion.usuario.avatar" :src="opinion.usuario.avatar">
            <img class="user__img" v-else src="../../assets/images/default.png" alt="Usuario">
            <button class="user__remove" @click="showConfirmation(opinion.id)"
              v-if="user !== null && (opinion.usuario.id === user.id || user.rol === 'ADMIN')">
              <img class="user__remove--icon" src="../../assets/icons/trash.svg">
              Eliminar
            </button>
          </section>
          <section class="opinion">
            <p class="opinion__info">@{{ opinion.usuario.nick }} &nbsp;&nbsp;·&nbsp;&nbsp;
              {{ formatoFecha(opinion.fecha) }}</p>
            <p class="opinion__text">{{ opinion.texto }}</p>
          </section>
        </article>
      </section>
    </section>
    <section v-else-if="!isLoading && opinions.length === 0" class="noOpinion">
      <p class="noOpinion__title">¡Oh no!</p>
      <p class="noOpinion__explain">
        Actualmente no hay opiniones de esta película. ¡Sé el primero en opinar!
      </p>
      <button class="noOpinion__button" @click="showForm">
        <img src="../../assets/icons/add.svg">
        Añade una opinión
      </button>
    </section>
    <ModalConfirmacion v-if="showModal" @close="hideConfirmation" @delete="deleteOpinion"
      :mensaje="'¿Esta seguro de querer eliminar este comentario?'"></ModalConfirmacion>
    <FormModal v-if="showAddComment" @close="hideForm" :formType="'addComment'">
    </FormModal>
  </section>
</template>

<script>
import Loader from '../Loader.vue'
import ModalConfirmacion from '../Overlays/ModalConfirmacion.vue'
import FormModal from '../Overlays/FormModal.vue'
import { getLoggedUser } from '../../store/user'

export default {
  name: "opinionMovie",
  components: {
    Loader,
    ModalConfirmacion,
    FormModal
  },
  data() {
    return {
      isLoading: true,
      opinions: [],
      showModal: false,
      idComentarioABorrar: null,
      showAddComment: false,
      user: getLoggedUser()
    }
  },
  methods: {
    /**
     * Se recogen los comentarios de la película
     */
    async getOpinions() {
      const apiUrl = import.meta.env.VITE_API_URL;
      return await fetch(`${apiUrl}/comentarios/pelicula/${this.$route.params.id}/paginado/0`)
        .then(response => response.json())
        .then(data => {
          this.opinions = data.comentarios;
          this.isLoading = false;
        });
    },
    /**
     * Formatea la fecha de la opinión de YYYY-MM-DD HH:MM:SS a DD/MM/YYYY
     * @returns {string} - Fecha formateada
     */
    formatoFecha(fecha) {
      const date = new Date(fecha);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const formattedDay = day < 10 ? `0${day}` : day;
      const formattedMonth = month < 10 ? `0${month}` : month;

      return `${formattedDay}/${formattedMonth}/${year}`;
    },
    /**
     * Elimina la opinión
     */
    deleteOpinion() {
      const apiUrl = import.meta.env.VITE_API_URL;
      const options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }
      fetch(`${apiUrl}/comentarios/${this.idComentarioABorrar}`, options)
        .then(response => response.json())
        .then(data => {
          if (data.id) {
            this.getOpinions();
            this.hideConfirmation();
          }
        })
    },
    showConfirmation(idComentario) {
      this.idComentarioABorrar = idComentario;
      this.showModal = true
    },
    /**
     * Oculta el mensaje de confirmación de compra
     */
    hideConfirmation() {
      this.idComentarioABorrar = null;
      this.showModal = false
    },
    /**
     * Muestra el formulario para añadir una opinión
     */
    showForm() {
      this.showAddComment = true;
    },
    /**
     * Oculta el formulario para añadir una opinión
     */
    hideForm() {
      this.showAddComment = false;
    }
  },
  mounted() {
    this.isLoading = true;
    this.getOpinions();
  }
}
</script>