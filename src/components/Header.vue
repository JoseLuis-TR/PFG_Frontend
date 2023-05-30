<template>
    <header class="header">
        <section class="header__container">
            <img src="../assets/images/logoHaven.svg" 
                class="header__container__logo"
                @click="redirectToIndex()">
            <img src="../assets/icons/menu.svg" class="header__container__menu" >
        </section>
    </header>
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

  export default {
      name: 'Header',
      methods:{
        redirectToIndex(){
          this.$router.push('/')
        },
      }
  }
</script>