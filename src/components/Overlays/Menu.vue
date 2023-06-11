<template>
  <Transition name="menuBackground">
    <article v-if="menuOpen" class="menuContainer" @click.self="$emit('close-menu')">
      <Transition class="menuModal">
        <nav class="menuContainer__overlay">
          <header class="yesUser" v-if="user">
            <img class="yesUser__img" :src="user.avatar ? user.avatar : 'src/assets/images/default.png'">
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
              <img class="listaMenu__item--img" src="../../assets/icons/home.svg">
              <p class="listaMenu__item--text">Inicio</p>
            </li>
            <li @click="goToCatalogo()" class="listaMenu__item">
              <img class="listaMenu__item--img" src="../../assets/icons/video.svg">
              <p class="listaMenu__item--text">Catálogo</p>
            </li>
            <li @click="goToContact()" class="listaMenu__item">
              <img class="listaMenu__item--img" src="../../assets/icons/mail.svg">
              <p class="listaMenu__item--text">Contacto</p>
            </li>
            <li @click="logOut()" class="listaMenu__item logout" v-if="userLogged()">
              <img class="listaMenu__item--img" src="../../assets/icons/logout.svg">
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
  methods: {
    userLogged() {
      const userIsLogged = sessionStorage.getItem('loggedUser');
      if (userIsLogged) {
        return true;
      } else {
        return false;
      }
    },
    goToHome() {
      this.$emit('close-menu');
      this.$router.push('/');
    },
    goToCatalogo() {
      this.$emit('close-menu');
      this.$router.push('/catalogo');
    },
    logOut() {
      logoutUser();
      this.user = null;
      this.$emit('close-menu');
      this.$router.push('/');
    },
    goToContact() {
      this.$emit('close-menu');
      this.$emit('open-contact');
    }
  }
}
</script>