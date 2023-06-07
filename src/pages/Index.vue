<template>
    <section class="inicio">
        <article class="inicio__superior">
            <Carrusel />
            <TopEsperadas />
        </article>
        <article class="inicio__inferior">
            <h2 class="inicio__inferior__titulo">Proximas sesiones</h2>
            <Cartelera />
        </article>
    </section>
</template>

<script>
  /**
   * @file Index.vue - Página principal de la aplicación web Haven Cinema
   * @author José Luis Tocino Rojo
   * @see <a href="https://github.com/JoseLuis-TR/cines_haven" target="_blank">Github</a>
  */

  /**
   * @property {string} name - Nombre del componente
   * @property {Object} components - Componentes que se utilizan en la página
   * @property {Object} components.Header - Componente header de la página
   * @property {Object} components.Carrusel - Componente carrusel de la página
   * @property {Object} components.TopEsperadas - Componente top de películas más esperadas
   * @property {Object} components.Cartelera - Componente cartelera de la página
   */ 
  import Carrusel from '../components/Carrusel.vue';
  import TopEsperadas from '../components/TopEsperadas.vue';
  import Header from '../components/Header.vue'
  import Cartelera from '../components/Cartelera/Cartelera.vue';

  export default{
    name: 'Index',
    components: {
    Header,
    Carrusel,
    TopEsperadas,
    Cartelera
    }
  }
</script>