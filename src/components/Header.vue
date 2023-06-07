<template>
  <header class="header">
    <section class="header__container">
      <img src="../assets/images/logoHaven.svg" class="header__container__logo" @click="redirectToIndex()">
      <img src="../assets/icons/menu.svg" class="header__container__menu" @click="menuOpen = true">
    </section>
  </header>
  <Menu 
    :menuOpen="menuOpen" 
    @close-menu="menuOpen = false" 
    @open-user-form="openUserForm()"
    @open-contact="contactOpen = true"
    @open-edit-user="openEditForm()"
  ></Menu>
  <LRUser 
    :is-needed="formUserOpen" 
    @close-user-form="formUserOpen = false">
  </LRUser>
  <FormModal
    v-if="contactOpen"
    :form-type="'contact'"
    @close="contactOpen = false">
  </FormModal>
  <EditUser
    :need-profile="editUserOpen"
    @close-profile="editUserOpen = false"
  ></EditUser>
</template>

<script>
/**
 * @file Header.vue - Componente que contiene el header de la página web
 * @author José Luis Tocino Rojo
 * @see <a href="https://github.com/JoseLuis-TR/cines_haven" target="_blank">Github</a>
*/

/**
 * @property {string} name - Nombre del componente
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
    redirectToIndex() {
      this.$router.push('/')
    },
    openUserForm() {
      this.menuOpen = false;
      this.formUserOpen = true;
    },
    openEditForm() {
      this.menuOpen = false;
      this.editUserOpen = true;
    }
  }
}
</script>