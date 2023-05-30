import { defineStore } from "pinia";

/**
 * @module Store_User
 */

/**
 * Objeto que mantiene el estado del usuario en la aplicación y contiene las funciones
 * relacionadas con el propio usuario.
 * 
 * @memberof module:Store_User
 * @constant {object} userStore
 * @property {object} state - Datos almacenados
 * @property {object} state.user - Objeto del usuario almacenado
 * @property {function} actions - Funciones relacionadas con el usuario
 * @property {function} actions.fetchUser - Obtiene los datos del usuario
 * @property {function} actions.signUp - Registra un usuario
 * @property {function} actions.signIn - Inicia sesión con un usuario
 */
export const userStore = defineStore("user", {
  state: () => ({
    user: null,
  }),

    actions: {
    /**
     * Obtiene los datos del usuario
     * 
     * @function fetchUser
     * @return {object} Objeto con los datos del usuario
     */
    async fetchUser() {
      // https://upmostly.com/vue-js/how-to-use-vue-with-pinia-to-set-up-authentication
    },

    /**
     * Inicia sesión con un usuario
     * 
     * @function loginUser
     * @param {string} email - Correo electrónico del usuario
     * @param {string} password - Contraseña del usuario
     * @return {object} Objeto con los datos del usuario
     **/
    async loginUser(email, password) {
    
    /**
     * Inicia sesión con un usuario
     */
    },
    async registerUser(email, password) {
        
      }
  },
});