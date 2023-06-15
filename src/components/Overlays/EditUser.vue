<template>
  <Transition name="formBackground">
    <article ref="Perfil" class="formBG" @click.self="$emit('close-profile')" v-intersect>
      <article class="formContainer">
        <form @submit.prevent="enviarInfoUsuario" class="formContainer__body" enctype="multipart/form-data">
          <fieldset class="formContainer__body__imageHandler">
            <img class="formContainer__body__imageHandler--image" v-if="!showDefaultAvatar" :src="avatarToShow"
              alt="Avatar de usuario">
            <img class="formContainer__body__imageHandler--image" v-else src="../../assets/images/default.png"
              alt="Avatar de usuario">
            <label for="profilePicture" class="formContainer__body__imageHandler--label">
              Escoge imagen de perfil
            </label>
            <input id="profilePicture" class="formContainer__body__imageHandler--input" type="file" accept="image/*"
              @change="handleFileInput" :multiple="false" ref="imageFile">
          </fieldset>
          <fieldset class="formContainer__body__userDataHandler">
            <label for="email">Email</label>
            <input v-model="emailData" v-on:blur="validateEmail" :class="{ 'input_error': !modEmailOk }" id="email"
              type="email" placeholder="Nuevo email...">
            <label for="username">Usuario</label>
            <input v-model="nickData" v-on:blur="validateUser" :class="{ 'input_error': !modUserOk }" id="username"
              type="text" placeholder="Nuevo nombre de usuario...">
            <label for="password">Contraseña</label>
            <input v-model="passData" v-on:blur="validatePass" :class="{ 'input_error': !modPassOk }" id="password"
              type="password" placeholder="Nueva contraseña...">
          </fieldset>
          <Transition name="errorMessage">
            <section v-show="!modEmailOk || !modPassOk || !modUserOk || errorMessage !== null"
              class="formContainer__body__form--error">
              <ul>
                <li v-if="!modEmailOk">Email no válido</li>
                <li v-if="!modUserOk">Usuario no válido [5 a 20 caracteres, sólo letras y números]</li>
                <li v-if="!modPassOk">Contraseña no válida [8 a 32 caracteres, mayúscula, minúscula, carácter especial y
                  número]</li>
                <li v-if="errorMessage !== null">{{ errorMessage }}</li>
              </ul>
            </section>
          </Transition>
          <button class="formContainer__body__userDataHandler--submit">Modificar usuario</button>
        </form>
      </article>
    </article>
  </Transition>
</template>

<script>
import { validateEmailRegex, validatePasswordRegex, validateUserRegex } from "../../functions/formValidations.js";
import { getLoggedUser } from "../../store/user";

/**
 * @file EditUser.vue - Componente de edición de usuario
 * @author José Luis Tocino Rojo
 * @see <a href="https://github.com/JoseLuis-TR/cines_haven" target="_blank">Github</a>
 * @module Component/Overlays/EditUser
 * 
 * @property {Object} data - Datos del componente Vue
 * @property {String} data.imageUrl - URL de la imagen de perfil
 * @property {String} data.errorMessage - Mensaje de error
 * @property {String} data.imageFile - Archivo de imagen de avatar
 * @property {String} data.emailData - Email del usuario
 * @property {String} data.nickData - Nick del usuario
 * @property {String} data.passData - Contraseña del usuario
 * @property {Boolean} data.modEmailOk - Validación de email
 * @property {Boolean} data.modUserOk - Validación de usuario
 * @property {Boolean} data.modPassOk - Validación de contraseña
 * @property {Object} data.loggedUser - Datos del usuario logueado
 * @property {Boolean} data.showDefaultAvatar - Mostrar avatar por defecto
 * @property {String} data.avatarToShow - Imagen de perfil a mostrar en el componente
 * @property {Object} emits - Eventos del componente
 * @property {Function} emits.close-profile - Cierra el componente
 */
export default {
  name: "EditUser",
  data() {
    return {
      imageUrl: null,
      errorMessage: null,
      imageFile: "",
      emailData: "",
      nickData: "",
      passData: "",
      modEmailOk: true,
      modUserOk: true,
      modPassOk: true,
      loggedUser: getLoggedUser(),
      avatarToShow: null,
      showDefaultAvatar: true,
    }
  },
  emits: ['close-profile'],
  methods: {
    /**
     * Función que se ejecuta cuando se selecciona un archivo de imagen y nos ayuda a mostrar la
     * imagen seleccionada en el formulario
     * @param event Recibe el evento de selección de archivo
     */
    handleFileInput(event) {
      // Si se selecciona un archivo y es una imagen, ok
      if (event.target.files.length === 1 && event.target.files[0].type.startsWith('image/')) {
        const selectedFile = event.target.files[0];
        this.imageUrl = URL.createObjectURL(selectedFile);
        this.errorMessage = null;
        this.showedAvatar('newUserAvatar', this.imageUrl)
      } else {
        this.errorMessage = "Por favor, seleccione solo un archivo de imagen";
      }
    },
    /**
     * Función que envia al servidor los datos del usuario para modificarlos
     */
    async enviarInfoUsuario() {
      if (this.emailData === "" && this.nickData === "" && this.passData === "" && this.$refs.imageFile.files[0] === undefined) {
        this.errorMessage = "Por favor, rellene los campos que desee modificar";
        return;
      }

      const newUserData = {
        'email': this.emailData === '' ? '' : this.emailData,
        'nick': this.nickData === '' ? '' : this.nickData,
        'clave': this.passData === '' ? '' : this.passData,
      }

      const formData = new FormData();

      const jsonUserData = JSON.stringify(newUserData);

      const blobUser = new Blob([jsonUserData], {
        type: 'application/json'
      });

      formData.append('userToUpdate', blobUser);
      formData.append('newAvatar', this.$refs.imageFile.files[0] ? this.$refs.imageFile.files[0] : '');

      const apiUrl = import.meta.env.VITE_API_URL;

      const response = await fetch(`${apiUrl}/usuario?idUsuario=${this.loggedUser.id}`, {
        method: 'PUT',
        body: formData
      });
      const newUserDataUpdated = await response.json();
      this.$router.go();
    },
    /**
     * Función que valida el email
     */
    validateEmail() {
      if (this.emailData === "") {
        this.modEmailOk = true
        return;
      }
      this.modEmailOk = validateEmailRegex(this.emailData)
    },
    /**
     * Función que valida el usuario
     */
    validateUser() {
      if (this.nickData === "") {
        this.modUserOk = true
        return;
      }
      this.modUserOk = validateUserRegex(this.nickData)
    },
    /**
     * Función que valida la contraseña
     */
    validatePass() {
      // Si esta vacio el input de contraseña se recoge como ok ya que no es obligatorio
      if (this.passData === "") {
        this.modPassOk = true
      } else
        this.modPassOk = validatePasswordRegex(this.passData)
    },
    /**
     * Función que decide que imagen de avatar mostrar
     * @param {String} whatINeed - Que imagen de avatar se necesita mostrar
     * @param {String} newAvatar - Nueva imagen de avatar
     */
    showedAvatar(whatINeed, newAvatar = null) {
      const defaultAvatar = "../../assets/images/default.png";
      if (whatINeed === "initialAvatar" && this.loggedUser) {
        this.avatarToShow = (this.loggedUser.avatar !== null && this.loggedUser.avatar !== '') ? this.loggedUser.avatar : defaultAvatar;
        if (this.loggedUser.avatar === null) {
          this.showDefaultAvatar = true;
        } else {
          this.showDefaultAvatar = false;
          this.avatarToShow = this.loggedUser.avatar;
        }
      }
      if (whatINeed === 'newUserAvatar') {
        this.showDefaultAvatar = false;
        this.avatarToShow = newAvatar;
      }
    }
  },
  mounted() {
    this.showedAvatar("initialAvatar");
  }
}
</script>