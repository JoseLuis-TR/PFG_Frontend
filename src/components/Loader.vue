<template>
  <section class="loader">
    <p class="loader__text">
      {{ mensajeCarga }}
    </p>
    <img class="loader__img" src="../assets/images/tail-spin.svg">
  </section>
</template>

<script>
/**
 * @file Loader.vue - Componente que contiene la pantalla de carga de la página web
 * @author José Luis Tocino Rojo
 * @see <a href="https://github.com/JoseLuis-TR/PFG_Frontend" target="_blank">Github</a>
 * @module Component/Loader
 * 
 * @property {Object} props - Propiedades que recibe el componente
 * @property {string} props.mensajeCarga - Mensaje que se muestra en la pantalla de carga
 */

export default {
  name: "Loader",
  props: ["mensajeCarga"]
}
</script>