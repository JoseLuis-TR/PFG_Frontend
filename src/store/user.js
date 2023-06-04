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
      getUserFromCookie() {
        const cookies = document.cookie.split(";"); // Obtiene todas las cookies
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          const [cookieKey, cookieValue] = cookie.split("=");
          if (cookieKey === 'userID') {
            return decodeURIComponent(cookieValue); // Retorna el valor de la cookie
          }
        }
        return null;
      },
      /**
       * Obtiene los datos del usuario
       * 
       * @function fetchUser
       * @param {string} idUsuario - ID del usuario
       * @return {object} Objeto con los datos del usuario
       */
      async fetchUser(idUsuario) {
        const apiUrl = import.meta.env.VITE_API_URL;

        const response = await fetch(`${apiUrl}/usuario?idUsuario=${idUsuario}`);
        const data = await response.json();

        if(data.hasOwnProperty("nick")) {
          this.user = data;
          sessionStorage.setItem("user", JSON.stringify(data));
        } else {
          return;
        }
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
        const apiUrl = import.meta.env.VITE_API_URL;
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            clave: password
          }),
        };
        const response = await fetch("http://localhost:8080/usuario/login", options);
        const data = await response.json();
        if(data.hasOwnProperty("codigo")){
          return false;
        } else {
          this.user = data;
          return true;
        }
      },
      /**
       * Registro de un nuevo usuario
       * 
       * @function registerUser
       * @param {string} nick - Nick del usuario
       * @param {string} email - Correo electrónico del usuario
       * @param {string} password - Contraseña del usuario
       * @return {boolean} True si se ha registrado correctamente, false en caso contrario
       */
      async registerUser(nick, email, password) {
        const apiUrl = import.meta.env.VITE_API_URL;
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nick: nick,
            email: email,
            clave: password
          }),
        };

        const response = await fetch(`${apiUrl}/usuario`, options);

        const data = await response.json();

        if(data.hasOwnProperty("nick")) {
          this.user = data;
          return true;
        } else {
          return false;
        }
      }
  },
});