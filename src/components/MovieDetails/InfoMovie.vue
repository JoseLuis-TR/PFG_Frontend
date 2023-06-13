<template>
  <section class="infoContainer">
    <h2 class="infoContainer__title">Sinopsis y trailer</h2>
    <span class="infoContainer__divider"></span>
    <p class="infoContainer__sinopsis">
      {{ movieData.sinopsis }}
    </p>
    <div class="videoContainer">
      <iframe v-if="youtubeUrl" class="videoContainer__video" :src="`https://www.youtube.com/embed/${youtubeUrl}`"
        frameborder="0" allowfullscreen></iframe>
      <ErrorComp v-else mensajeError="No hay trailer disponible para esta película" />
    </div>
  </section>
</template>

<script>
import ErrorComp from "../Error.vue";

/**
 * @file InfoMovie.vue - Vista de la información de la película en la página de detalles de una película.
 * Muestra la sinopsis y el trailer de la película. Si no hay trailer muestra un mensaje de error.
 * @author José Luis Tocino Rojo
 * @see <a href="https://github.com/JoseLuis-TR/PFG_Frontend" target="_blank">Github</a>
 * @module Component/MovieDetails/InfoMovie
 * 
 * @property {Object} components - Componentes que usa el componente
 * @property {Object} components.ErrorComp - Componente de error
 * @property {Object} data - Datos del componente
 * @property {string} data.youtubeUrl - Url del trailer de la película
 * @property {Object} data.movieData - Datos de la película
 */
export default {
  name: "infoMovie",
  components: {
    ErrorComp
  },
  data() {
    return {
      youtubeUrl: "",
      movieData: {}
    };
  },
  methods: {
    /**
     * Llama a la Api para recibir los datos de la película
     * 
     * @param {number} movieId - Id de la película
     * @returns {Object} - Datos de la película
     */
    async getMovieDetails(movieId) {
      const apiUrl = import.meta.env.VITE_API_URL;
      return await fetch(`${apiUrl}/peliculas?idPelicula=${movieId}`)
        .then(response => response.json())
        .then(data => {
          this.movieData = data;
          this.isLoading = false;
        });
    },
    /**
     * Extrae el id del video de youtube -> busca aceptar los formatos más usados
     * 
     * @param {string} url - Url del video de youtube
     * @returns {string} - Id del video de youtube
     */
    extractYoutubeId(url) {
      if (!url) this.urlIsCorrect = false;
      if (url.length == 11) this.youtubeUrl = url;

      let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      let match = url.match(regExp);
      return (match && match[7].length == 11) ? match[7] : false;
    }
  },
  async mounted() {
    // Se recogen los datos de la película y se recorta la url del trailer
    await this.getMovieDetails(this.$route.params.id);
    this.youtubeUrl = this.extractYoutubeId(this.movieData.trailer);
  }
}
</script>