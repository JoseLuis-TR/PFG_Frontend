<template>
  <section class="inicio">
    <article class="inicio__superior">
      <Carrusel />
      <TopEsperadas />
    </article>
    <article class="inicio__inferior">
      <h2 class="inicio__inferior__titulo">Proximas sesiones</h2>
      <button class="opinions__add" @click="showAddSession = true" v-if="user && user.rol === 'ADMIN'">
        <img src="../assets/icons/add.svg">
        Añade una sesión
      </button>
      <Cartelera />
    </article>
  </section>
  <AddSession v-if="showAddSession" @close="showAddSession = false"></AddSession>
</template>

<script>
/**
 * @file Index.vue - Página principal de la aplicación
 * @author José Luis Tocino Rojo
 * @see <a href="https://github.com/JoseLuis-TR/PFG_Frontend" target="_blank">Github</a>
 * @module View/Index
 * 
 * @property {Object} components - Componentes que se utilizan en la página
 * @property {Object} components.Header - Componente header de la página
 * @property {Object} components.Carrusel - Componente carrusel de la página
 * @property {Object} components.TopEsperadas - Componente top de películas más esperadas
 * @property {Object} components.Cartelera - Componente cartelera de la página
 * @property {Object} components.AddSession - Componente que contiene el formulario para añadir una sesión
 * @property {Object} data - Datos del componente
 * @property {boolean} data.showAddSession - Indica si se muestra el formulario para añadir una sesión
 * @property {Object} data.user - Usuario logueado
 */
import Carrusel from '../components/Carrusel.vue';
import TopEsperadas from '../components/TopEsperadas.vue';
import Header from '../components/Header.vue'
import Cartelera from '../components/Cartelera/Cartelera.vue';
import AddSession from '../components/Overlays/AddSession.vue';
import { getLoggedUser } from '../store/user';

export default {
  name: 'Index',
  components: {
    Header,
    Carrusel,
    TopEsperadas,
    Cartelera,
    AddSession
  },
  data() {
    return {
      showAddSession: false,
      user: getLoggedUser()
    }
  },
}
</script>