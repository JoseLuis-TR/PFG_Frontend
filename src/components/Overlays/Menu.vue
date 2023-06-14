<template>
  <Transition name="menuBackground">
    <article v-if="menuOpen" class="menuContainer" @click.self="$emit('close-menu')">
      <Transition class="menuModal">
        <nav class="menuContainer__overlay">
          <header class="yesUser" v-if="user">
            <img class="yesUser__img" alt="Avatar de usuario"
              :src="user.avatar ? user.avatar : 'src/assets/images/default.png'">
            <p class="yesUser__nick">@{{ user.nick }}</p>
            <a class="yesUser__edit" @click="$emit('open-edit-user')">Editar perfil</a>
          </header>
          <header class="noUser" v-else @click="$emit('open-user-form')">
            <p class="text">
              <span class="underline">Inicia sesión</span>
              <br>o<br>
              <span class="underline">Registrate</span>
            </p>
          </header>
          <ul class="listaMenu">
            <li @click="goToHome()" class="listaMenu__item">
              <img class="listaMenu__item--img" src="../../assets/icons/home.svg" alt="Icono de inicio">
              <p class="listaMenu__item--text">Inicio</p>
            </li>
            <li @click="goToCatalogo()" class="listaMenu__item">
              <img class="listaMenu__item--img" src="../../assets/icons/video.svg" alt="Icono del catálogo">
              <p class="listaMenu__item--text">Catálogo</p>
            </li>
            <li @click="goToContact()" class="listaMenu__item">
              <img class="listaMenu__item--img" src="../../assets/icons/mail.svg" alt="Icono de contacto">
              <p class="listaMenu__item--text">Contacto</p>
            </li>
            <li @click="logOut()" class="listaMenu__item logout" v-if="userLogged()">
              <img class="listaMenu__item--img" src="../../assets/icons/logout.svg" alt="Icono de cierre de sesión">
              <p class="listaMenu__item--text">Cierra sesión</p>
            </li>
          </ul>
        </nav>
      </Transition>
    </article>
  </Transition>
</template>

<script>
import { getLoggedUser, logoutUser } from '../../store/user';

/**
 * @file Menu.vue - Menu de navegación de la aplicación
 * @author José Luis Tocino Rojo
 * @see <a href="https://github.com/JoseLuis-TR/PFG_Frontend" target="_blank">Github</a>
 * @module Component/Overlays/Menu
 * 
 * @property {Object} props - Propiedades recibidas por el componente
 * @property {Boolean} props.menuOpen - Indica si el menú está abierto o no
 * @property {Object} data - Datos del componente
 * @property {Object} data.user - Usuario logueado
 * @property {Function} emits - Eventos lanzados por el componente
 * @property {Function} emits.close-menu - Cierra el menú
 * @property {Function} emits.open-user-form - Abre el formulario de login/registro
 * @property {Function} emits.open-edit-user - Abre el formulario de edición de usuario
 * @property {Function} emits.open-contact - Abre el formulario de contacto
 */
export default {
  name: 'Menu',
  props: {
    menuOpen: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      user: getLoggedUser(),
    }
  },
  emits: ['close-menu', 'open-user-form', 'open-edit-user', 'open-contact'],
  methods: {
    /**
     * Comprueba que haya un usuario logueado
     * @returns {Boolean} - True si hay un usuario logueado, false si no
     */
    userLogged() {
      const userIsLogged = sessionStorage.getItem('loggedUser');
      if (userIsLogged) {
        return true;
      } else {
        return false;
      }
    },
    /**
     * Redirige a la página de inicio
     */
    goToHome() {
      this.$emit('close-menu');
      this.$router.push('/');
    },
    /**
     * Redirige a la página de catálogo
     */
    goToCatalogo() {
      this.$emit('close-menu');
      this.$router.push('/catalogo');
    },
    /**
     * Cierra sesión
     */
    logOut() {
      logoutUser();
      this.user = null;
      this.$emit('close-menu');
      this.$router.go();
    },
    /**
     * Muestra el formulario de contacto
     */
    goToContact() {
      this.$emit('close-menu');
      this.$emit('open-contact');
    }
  }
}
</script>