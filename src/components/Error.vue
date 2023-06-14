<template>
  <section class="errorContainer">
    <p class="errorContainer__title">¡Oh no!</p>
    <p class="errorContainer__text">{{ mensajeError }}</p>
    <img src="../assets/icons/sad.svg" alt="Emoji triste" class="errorContainer__sad">
  </section>
</template>

<script>

/**
 * @file Error.vue - Componente que contiene la pantalla de error cuando no existe contenido que mostrar
 * @author José Luis Tocino Rojo
 * @see <a href="https://github.com/JoseLuis-TR/PFG_Frontend" target="_blank">Github</a>
 * @module Component/ErrorComp
 * 
 * @property {Object} props - Propiedades que recibe el componente
 * @property {string} props.mensajeError - Mensaje que se muestra en la pantalla de error
 */
export default {
  name: "ErrorComp",
  props: ["mensajeError"]
}
</script>