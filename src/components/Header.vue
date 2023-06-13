<template>
  <header class="header">
    <section class="header__container">
      <img src="../assets/images/logoHaven.svg" class="header__container__logo" @click="redirectToIndex()">
      <img src="../assets/icons/menu.svg" class="header__container__menu" @click="menuOpen = true">
    </section>
  </header>
  <Menu :menuOpen="menuOpen" @close-menu="menuOpen = false" @open-user-form="openUserForm()"
    @open-contact="contactOpen = true" @open-edit-user="openEditForm()"></Menu>
  <LRUser :is-needed="formUserOpen" @close-user-form="formUserOpen = false">
  </LRUser>
  <FormModal v-if="contactOpen" :form-type="'contact'" @close="contactOpen = false">
  </FormModal>
  <EditUser v-if="editUserOpen" @close-profile="editUserOpen = false"></EditUser>
</template>

<script>
/**
 * @file Header.vue - Componente que contiene el header de la página web
 * @author José Luis Tocino Rojo
 * @see <a href="https://github.com/JoseLuis-TR/cines_haven" target="_blank">Github</a>
 * @module Component/Header
 * 
 * @property {Object} components - Componentes que se utilizan en la página
 * @property {Object} components.Menu - Componente que contiene el menú de la página
 * @property {Object} components.LRUser - Componente que contiene el formulario de login y registro
 * @property {Object} components.FormModal - Componente que contiene el formulario de contacto
 * @property {Object} components.EditUser - Componente que contiene el formulario de edición de usuario
 * @property {Object} data - Variables que se utilizan en la página
 * @property {boolean} data.menuOpen - Variable que indica si el menú está abierto o no
 * @property {boolean} data.formUserOpen - Variable que indica si el formulario de login y registro está abierto o no
 * @property {boolean} data.contactOpen - Variable que indica si el formulario de contacto está abierto o no
 * @property {boolean} data.editUserOpen - Variable que indica si el formulario de edición de usuario está abierto o no
 */
import Menu from './Overlays/Menu.vue';
import LRUser from './Overlays/LRUser.vue';
import FormModal from './Overlays/FormModal.vue';
import EditUser from './Overlays/EditUser.vue';

export default {
  name: 'Header',
  components: {
    Menu,
    LRUser,
    FormModal,
    EditUser
  },
  data() {
    return {
      menuOpen: false,
      formUserOpen: false,
      contactOpen: false,
      editUserOpen: false
    }
  },
  methods: {
    /**
     * Redirige a la página principal
     */
    redirectToIndex() {
      this.$router.push('/')
    },
    /**
     * Abre el formulario de login y registro
     */
    openUserForm() {
      this.menuOpen = false;
      this.formUserOpen = true;
    },
    /**
     * Abre el formulario de edición de usuario
     */
    openEditForm() {
      this.menuOpen = false;
      this.editUserOpen = true;
    }
  }
}
</script>