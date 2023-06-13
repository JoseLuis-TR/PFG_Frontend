<template>
  <Transition name="formBackground">
    <article class="formBG" v-if="isNeeded" @click.self="$emit('close-userForm')">
      <Transition name="formModal">
        <article class="formContainer">
          <section class="formContainer__selectors">
            <button type="button" @click="showForm = 'login'" :class="{ btnActivated: showForm === 'login' }">Inicia
              sesión</button>
            <button type="button" @click="showForm = 'register'"
              :class="{ btnActivated: showForm === 'register' }">Regístrate</button>
          </section>
          <template v-if="showForm === 'login'">
            <section class="formContainer__body">
              <p class="formContainer__body--text">Inicia sesión en tu cuenta de cines Haven</p>
              <form class="formContainer__body__form" v-on:submit.prevent="checkLogin(userLog, passLog)">
                <label for="nick">Email</label>
                <input v-model="userLog" id="nick" type="text" placeholder="Escriba su email...">
                <label for="password">Contraseña</label>
                <input v-model="passLog" id="password" type="password" placeholder="Escriba su contraseña...">
                <Transition name="errorMessage">
                  <section v-show="messageError !== ''" class="formContainer__body__form--error">
                    <ul>
                      <li>{{ this.messageError }}</li>
                    </ul>
                  </section>
                </Transition>
                <button>Inicia sesión</button>
              </form>
            </section>
          </template>
          <template v-else-if="showForm === 'register'">
            <section class="formContainer__body">
              <p class="formContainer__body--text">Únete para poder disfrutar de todas las opciones que ofrece Cines Haven
              </p>
              <form class="formContainer__body__form"
                v-on:submit.prevent="createNewUser(emailReg, nickReg, passReg, repPassReg)">
                <label for="email">Email</label>
                <input v-model="emailReg" v-on:blur="validateEmail" :class="{ 'input_error': !regexEmailOk }" id="email"
                  type="email" placeholder="Escriba su email...">
                <label for="username">Usuario</label>
                <input v-model="nickReg" v-on:blur="validateUser" :class="{ 'input_error': !regexUserOk }" id="username"
                  type="text" placeholder="Escriba su nombre de usuario...">
                <label for="password">Contraseña</label>
                <input v-model="passReg" v-on:blur="validatePass" :class="{ 'input_error': !regexPassOk }" id="password"
                  type="password" placeholder="Escriba su contraseña...">
                <label for="repPassword">Repetir contraseña</label>
                <input v-model="repPassReg" v-on:blur="validateRepeatPass" :class="{ 'input_error': !repeatPassOk }"
                  id="repPassword" type="password" placeholder="Repita su contraseña...">
                <Transition name="errorMessage">
                  <section
                    v-show="!regexEmailOk || !regexPassOk || !regexUserOk || !repeatPassOk || !emailExistsOk || !nickExistsOk || messageError !== ''"
                    class="formContainer__body__form--error">
                    <ul>
                      <li v-if="!regexEmailOk">Email no válido</li>
                      <li v-if="!regexUserOk">Usuario no válido [5 a 20 caracteres, sólo letras y números]</li>
                      <li v-if="!regexPassOk">Contraseña no válida [8 a 32 caracteres, mayúscula, minúscula, carácter
                        especial y número]</li>
                      <li v-if="!repeatPassOk">Las contraseñas no coinciden</li>
                      <li v-if="!emailExistsOk">El email ya esta en uso</li>
                      <li v-if="!nickExistsOk">El nombre de usuario ya esta en uso </li>
                      <li v-if="messageError !== ''">{{ messageError }}</li>
                    </ul>
                  </section>
                </Transition>
                <button>Regístrate</button>
              </form>
            </section>
          </template>
        </article>
      </Transition>
    </article>
  </Transition>
</template>
  
<script>
import {
  validateEmailRegex,
  validatePasswordRegex,
  validateSamePassRegex,
  validateUserRegex
} from "../../functions/formValidations.js";
import { loginUser, registerNewUser } from "../../store/user";

/**
 * @file LRUser.vue - Componente para mostrar el formulario de login y registro
 * @author José Luis Tocino Rojo
 * @see <a href="https://github.com/JoseLuis-TR/PFG_Frontend" target="_blank">Github</a>
 * @module Component/Overlays/LRUser
 * 
 * @property {Object} props - Propiedades recibidas por el componente
 * @property {Boolean} props.isNeeded - Indica si el componente debe mostrarse
 * @property {Object} emits - Eventos emitidos por el componente
 * @property {Function} emits.close-userForm - Evento para cerrar el formulario
 * @property {Object} data - Datos del componente
 * @property {String} data.showForm - Indica que formulario debe mostrarse
 * @property {String} data.userLog - Email del usuario para el login
 * @property {String} data.passLog - Contraseña del usuario para el login
 * @property {String} data.messageError - Mensaje de error del formulario
 * @property {String} data.emailReg - Email del usuario para el registro
 * @property {String} data.nickReg - Nombre de usuario del usuario para el registro
 * @property {String} data.passReg - Contraseña del usuario para el registro
 * @property {String} data.repPassReg - Repetición de la contraseña del usuario para el registro
 * @property {Boolean} data.regexEmailOk - Indica si el email es válido
 * @property {Boolean} data.regexUserOk - Indica si el nombre de usuario es válido
 * @property {Boolean} data.regexPassOk - Indica si la contraseña es válida
 * @property {Boolean} data.repeatPassOk - Indica si la repetición de la contraseña es válida
 * @property {Boolean} data.nickExistsOk - Indica si el nombre de usuario ya existe en la base de datos
 * @property {Boolean} data.emailExistsOk - Indica si el email ya existe en la base de datos
 */
export default {
  name: "LRUser",
  props: {
    isNeeded: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close-userForm'],
  data() {
    return {
      showForm: 'login',
      userLog: '',
      passLog: '',
      messageError: '',
      emailReg: '',
      nickReg: '',
      passReg: '',
      repPassReg: '',
      regexEmailOk: true,
      regexUserOk: true,
      regexPassOk: true,
      repeatPassOk: true,
      nickExistsOk: true,
      emailExistsOk: true
    }
  },
  /**
   * Se detectan los cambios en el formulario para mostrar el mensaje de error
   */
  watch: {
    showForm() {
      this.messageError = "";
    }
  },
  methods: {
    /**
     * Revisa el login del usuario
     * @param {String} logUser - Nombre de usuario
     * @param {String} logPass - Contraseña
     */
    async checkLogin(logUser, logPass) {
      const loginResult = await loginUser(logUser, logPass)

      if (!loginResult) {
        this.messageError = 'El email o la contraseña son incorrectos'
        return;
      } else {
        this.messageError = 'Login correcto'
        this.$router.go();
      }
    },
    /**
     * Revisa si el nick introducido esta siendo usado por otro usuario
     * 
     * @param {String} nick - Nick del usuario
     */
    async nickIsUsed() {
      const apiUrl = import.meta.env.VITE_API_URL;

      await fetch(`${apiUrl}/usuario/nick?nickBuscado=${this.nickReg}`)
        .then(response => response.json())
        .then(data => {
          if (data === true) {
            this.nickExistsOk = false
          } else {
            this.nickExistsOk = true
          }
        })
    },
    /**
     * Revisa si el email introducido esta siendo usado por otro usuario
     * 
     * @param {String} email - Email del usuario
     */
    async emailIsUsed() {
      const apiUrl = import.meta.env.VITE_API_URL;

      await fetch(`${apiUrl}/usuario/email?emailBuscado=${this.emailReg}`)
        .then(response => response.json())
        .then(data => {
          if (data === true) {
            this.emailExistsOk = false
          } else {
            this.emailExistsOk = true
          }
        })
    },
    /**
     * Valida el email introducido
     */
    validateEmail() {
      this.regexEmailOk = validateEmailRegex(this.emailReg)
      this.emailIsUsed()
    },
    /**
     * Valida el usuario introducido
     */
    validateUser() {
      this.regexUserOk = validateUserRegex(this.nickReg)
      this.nickIsUsed()
    },
    /**
     * Valida la contraseña introducida
     */
    validatePass() {
      this.regexPassOk = validatePasswordRegex(this.passReg)
    },
    /**
     * Valida que las contraseñas introducidas coinciden
     */
    validateRepeatPass() {
      this.repeatPassOk = validateSamePassRegex(this.repPassReg, this.passReg)
    },
    /**
     * Revisa que todos los campos del formulario de registro estén rellenos y sean válidos
     * @returns {Boolean} - Indica si todos los campos son válidos
     */
    lastCheckReg() {
      if (this.regexEmailOk && this.regexUserOk && this.regexPassOk && this.repeatPassOk && this.nickExistsOk && this.emailExistsOk)
        if (this.emailReg !== '' && this.nickReg !== '' && this.passReg !== '' && this.repPassReg !== '')
          return true
      return false
    },
    /**
     * Crea un nuevo usuario llamando a la api
     * @param {String} emailReg - Email del usuario
     * @param {String} userReg - Nombre de usuario
     * @param {String} passReg - Contraseña
     */
    async createNewUser(emailReg, userReg, passReg) {
      // Se comprueba que todos los campos sean válidos
      if (this.lastCheckReg()) {
        this.messageError = ''
        // Se crea el objeto con los datos del usuario
        const newUser = {
          "nick": userReg,
          "email": emailReg,
          "clave": passReg
        }
        const registerResult = await registerNewUser(newUser)

        if (!registerResult) {
          this.messageError = 'Error al crear el usuario'
          return;
        } else {
          this.messageError = 'Registro Completado'
          this.$router.go();
        }

      } else {
        // Se muestra un mensaje de error si no se han rellenado todos los campos
        this.messageError = 'Formulario incorrecto'
      }
    }
  }
}
</script>