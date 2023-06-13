<template>
  <Transition name="modalBG">
    <section class="modalContainer" @click.self="$emit('close')">
      <Transition name="modal" appear>
        <article class="modalForm">
          <section v-if="formType === 'addComment'">
            <p class="modalForm__comment">Escriba su comentario</p>
            <textarea class="modalForm__textarea" placeholder="Escriba su comentario aquí..." v-model.trim="comment"
              @keyup="countCharacters">
                        </textarea>
            <p class="modalForm__contador" :class="{ 'limit': contador === 500 }">{{ contador }}/500</p>
            <Transition name="errorMessage">
              <section v-show="error" class="formContainer__body__form--error">
                <ul>
                  <li>El comentario debe tener al menos 10 caracteres</li>
                </ul>
              </section>
            </Transition>
            <section class="modalForm__error" v-if="error">
              <p class="modalForm__error__title">Por favor, soluciona el siguiente error:</p>
              <ul class="modalForm__error__list">
                <li class="modalForm__error__list--item">El comentario debe tener al menos 10 caracteres.</li>
              </ul>
            </section>
            <section class="modalForm__buttons">
              <button class="modalForm__buttons--item" @click="addComment">Comentar</button>
              <button class="modalForm__buttons--item" @click="$emit('close')">Cancelar</button>
            </section>
          </section>
          <section v-if="formType === 'contact'">
            <p class="contact__text">¡Escribanos sus dudas, quejas o alabanzas en este formulario!</p>
            <form ref="contactForm" class="formContainer__body__form" v-on:submit.prevent="sendNewEmail()">
              <label for="email">Nombre</label>
              <input v-model="nameContact" id="email" type="text" min="3" placeholder="Escriba su nombre...">
              <label for="message">Mensaje</label>
              <textarea v-model="messageContact" id="message" type="text" min="10"
                placeholder="Escriba su mensaje..."></textarea>
              <Transition name="errorMessage">
                <section v-show="error" class="formContainer__body__form--error">
                  <ul>
                    <li>Se debe adjuntar un nombre y un mensaje antes de enviar</li>
                  </ul>
                </section>
              </Transition>
              <button>Enviar</button>
            </form>
          </section>
        </article>
      </Transition>
    </section>
  </Transition>
</template>

<script>
import emailjs from '@emailjs/browser';
import { getLoggedUser } from '../../store/user';

/**
 * @file FormModal.vue - Formulario para añadir comentarios y enviar emails
 * @author José Luis Tocino Rojo
 * @see <a href="https://github.com/JoseLuis-TR/PFG_Frontend" target="_blank">Github</a>
 * @module Component/Overlays/FormModal
 * 
 * @property {Object} props - Atributos del componente
 * @property {String} props.formType - Tipo de formulario que se va a mostrar
 * @property {Object} data - Datos del componente
 * @property {String} data.comment - Comentario que se va a añadir
 * @property {Number} data.contador - Contador de caracteres del comentario
 * @property {Boolean} data.error - Indica si hay un error en el formulario
 * @property {String} data.nameContact - Nombre del usuario que envía el email
 * @property {String} data.messageContact - Mensaje que se envía en el email
 * @property {Object} data.loggedUser - Usuario logueado
 * @property {Function} emits - Eventos que emite el componente
 * @property {String} emits.close - Cierra el modal
 */
export default {
  name: "FormModal",
  props: {
    formType: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      comment: '',
      contador: 0,
      error: false,
      nameContact: '',
      messageContact: '',
      loggedUser: getLoggedUser()
    }
  },
  emits: ['close'],
  methods: {
    /**
     * Cuenta los caracteres que se introducen en el textarea
     */
    countCharacters() {
      this.contador = this.comment.length;

      if (this.contador > 500) {
        this.comment = this.comment.substring(0, 500);
      }
    },
    /**
     * Añade un comentario a la película
     * Debe tener al menos 10 caracteres
     */
    addComment() {
      if (this.contador < 10) {
        this.error = true;
        return;
      } else {
        this.error = false;
        const commentPost = {
          id_usuario: this.loggedUser.id,
          id_pelicula: this.$route.params.id,
          texto: this.comment
        }
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(commentPost)
        }
        const apiUrl = import.meta.env.VITE_API_URL;
        fetch(`${apiUrl}/comentarios`, options)
          .then(response => response.json())
          .then(data => {
            this.$emit('close');
          })

        this.$router.go();
      }
    },
    /**
     * Envía un email al administrador
     * Debe tener un nombre y un mensaje
     */
    sendNewEmail() {
      if (this.nameContact === '' || this.messageContact === '') {
        this.error = true;
        return;
      }
      this.error = false;
      const templateParams = {
        name: this.nameContact,
        message: this.messageContact
      }
      emailjs.send('service_haven', 'template_haven', templateParams, 'oaqJACNZmWF9K5orh')
        .then((response) => {
          this.$emit('close');
        }
        );
    }
  }
}
</script>