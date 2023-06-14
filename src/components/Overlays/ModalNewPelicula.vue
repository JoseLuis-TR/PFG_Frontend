<template>
  <Transition name="modalBG">
    <section class="modalContainer" @click.self="$emit('close')">
      <Transition name="modal" appear>
        <article class="formContainer newMovie">
          <section class="showImages">
            <img class="showImages__poster" alt="Muestra de poster subido por input" :src="posterToShow">
            <img class="showImages__captura" alt="Muestra de captura subida por input" :src="capturaToShow">
          </section>
          <section class="inputImages">
            <label for="poster" class="inputImages__button">
              {{ action === 'edit' ? 'Editar' : 'Añadir' }} poster
            </label>
            <input id="poster" class="inputImages__input" type="file" accept="image/*" :multiple="false" ref="posterFile"
              @change="(event) => handleImageUpload(event, 'poster')">
            <label for="captura" class="inputImages__button">
              {{ action === 'edit' ? 'Editar' : 'Añadir' }} captura
            </label>
            <input id="captura" class="inputImages__input" type="file" accept="image/*" :multiple="false"
              ref="capturaFile" @change="(event) => handleImageUpload(event, 'captura')">
          </section>
          <form class="formContainer__body__form" v-on:submit.prevent="checkNewMovie()">
            <fieldset class="formContainer__body__userDataHandler">
              <label for="titulo">Titulo *</label>
              <input v-model="tituloData" :class="{ 'input_error': !modTituloOk }" v-on:blur="checkIfHaveValue('titulo')"
                id="titulo" type="text" placeholder="Titulo de la pelicula...">
              <label for="director">Director *</label>
              <input v-model="directorData" :class="{ 'input_error': !modDirectorOk }"
                v-on:blur="checkIfHaveValue('director')" id="director" type="text"
                placeholder="Director de la pelicula...">
              <label for="duracion">Duración *</label>
              <input v-model="duracionData" :class="{ 'input_error': !modDuracionOk }"
                v-on:blur="checkIfHaveValue('duracion')" id="duracion" maxlength="3" v-on:input="checkIsANumber"
                placeholder="Duración de la pelicula en minutos...">
              <label for="trailer">Trailer</label>
              <input v-model="trailerData" id="trailer" placeholder="Enlace a trailer en youtube (Opcional)">
              <label for="sinopsis">Sinopsis *</label>
              <textarea v-model="sinopsisData" @keyup="countCharacters" :class="{ 'input_error': !modSinopsisOk }"
                v-on:blur="checkIfHaveValue('sinopsis')" id="sinopsis"
                placeholder="Escriba un pequeño resumen de la pelicula...">
                            </textarea>
              <p class="modalForm__contador" :class="{ 'limit': contador === 750 }">{{ contador }}/750</p>
            </fieldset>
            <button>Añadir</button>
          </form>
        </article>
      </Transition>
    </section>
  </Transition>
</template>

<script>

/**
 * @file ModalNewPelicula.vue - Componente para añadir o editar una pelicula
 * @author José Luis Tocino Rojo
 * @see <a href="https://github.com/JoseLuis-TR/PFG_Frontend" target="_blank">Github</a>
 * @module Component/Ovelays/ModalNewPelicula
 * 
 * @property {Object} data - Objeto de datos del componente Vue
 * @property {String} data.posterToShow - Imagen del poster de la pelicula
 * @property {String} data.capturaToShow - Imagen de la captura de la pelicula
 * @property {String} data.errorMessage - Mensaje de error
 * @property {String} data.tituloData - Titulo de la pelicula
 * @property {Boolean} data.modTituloOk - Indica si el titulo es correcto
 * @property {String} data.directorData - Director de la pelicula
 * @property {Boolean} data.modDirectorOk - Indica si el director es correcto
 * @property {String} data.duracionData - Duración de la pelicula
 * @property {Boolean} data.modDuracionOk - Indica si la duración es correcta
 * @property {String} data.trailerData - Trailer de la pelicula
 * @property {String} data.sinopsisData - Sinopsis de la pelicula
 * @property {Boolean} data.modSinopsisOk - Indica si la sinopsis es correcta
 * @property {Number} data.contador - Contador de caracteres de la sinopsis
 * @property {Object} emits - Eventos emitidos por el componente
 * @property {String} emits.close - Cierra el modal
 * @property {Object} props - Propiedades recibidas del componente padre
 * @property {String} props.action - Acción a realizar (Añadir o editar)
 * @property {Object} props.toEdit - Pelicula a editar
 */
export default {
  name: "ModalNewPelicula",
  data() {
    return {
      posterToShow: this.toEdit ? this.toEdit.poster : 'https://placehold.co/300x450/png?text=Poster',
      capturaToShow: this.toEdit ? this.toEdit.captura : 'https://placehold.co/300x150/png?text=Captura',
      errorMessage: null,
      tituloData: this.toEdit ? this.toEdit.nombre : null,
      modTituloOk: true,
      directorData: this.toEdit ? this.toEdit.director : null,
      modDirectorOk: true,
      duracionData: this.toEdit ? this.toEdit.duracion : null,
      modDuracionOk: true,
      trailerData: this.toEdit ? this.toEdit.trailer : null,
      sinopsisData: this.toEdit ? this.toEdit.sinopsis : null,
      modSinopsisOk: true,
      contador: 0,
    }
  },
  emits: ['close'],
  props: {
    action: {
      type: String,
      required: true
    },
    toEdit: {
      type: Object,
      required: false
    }
  },
  methods: {
    /**
     * Obtiene la imagen que ha sido subida y crea un enlace para mostrarla
     * @param {Event} event - Evento de subida de imagen
     * @param {String} type - Tipo de imagen (poster o captura)
     */
    handleImageUpload(event, type) {
      if (event.target.files.length === 1 && event.target.files[0].type.startsWith('image/')) {
        const selectedFile = event.target.files[0];
        const fileUrl = URL.createObjectURL(selectedFile);
        this.errorMessage = null;
        if (type === 'poster') {
          this.showNewImage('poster', fileUrl);
        } else if (type === 'captura') {
          this.showNewImage('captura', fileUrl);
        }
      } else {
        this.errorMessage = 'Sólo se puede subir una imagen';
      }
    },
    /**
     * Comprueba que la imagen subida sea un poster o una captura
     * En caso de ser llamada al inicio añade la imagen por defecto
     * @param {String} type - Tipo de imagen (poster o captura)
     * @param {String} fileUrl - Enlace de la imagen
     */
    showNewImage(type, fileUrl = null) {
      if (type === 'poster') {
        this.posterToShow = fileUrl;
      } else if (type === 'captura') {
        this.capturaToShow = fileUrl;
      } else {
        this.posterToShow = 'https://placehold.co/300x450/png?text=Poster';
        this.capturaToShow = 'https://placehold.co/640x360/png?text=Captura';
      }
    },
    /**
     * Comprueba que el valor introducido sea un número
     * @param {Event} event - Evento de introducción de datos
     */
    checkIsANumber(event) {
      this.duracionData = event.target.value.replace(/\D/g, '');
    },
    /**
     * Comprueba que el valor introducido no esté vacío
     * @param {String} value - Valor introducido
     */
    checkIsNotEmpty(value) {
      if (value.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    /**
     * Cuenta los caracteres de la sinopsis y la recorta si es mayor de 750
     */
    countCharacters() {
      if (this.sinopsisData && this.sinopsisData.length > 750) {
        this.sinopsisData = this.sinopsisData.substring(0, 750);
      } else if (this.sinopsisData && this.sinopsisData.length > 0 && this.sinopsisData.length <= 750) {
        this.contador = this.sinopsisData.length;
      } else {
        this.contador = 0;
      }
    },
    /**
     * Comprueba que esten los datos obligatorios
     * @param {String} inputType - Tipo de dato a comprobar
     */
    checkIfHaveValue(inputType) {
      if (inputType === 'titulo') {
        this.modTituloOk = this.tituloData === '' || this.tituloData === null ? false : true;
      } else if (inputType === 'director') {
        this.modDirectorOk = this.directorData === '' || this.directorData === null ? false : true;
      } else if (inputType === 'duracion') {
        this.modDuracionOk = this.duracionData === '' || this.duracionData === null ? false : true;
      } else if (inputType === 'sinopsis') {
        this.modSinopsisOk = this.sinopsisData === '' || this.sinopsisData === null ? false : true;
      }
    },
    /**
     * Hace la subida de los datos de la nueva película
     * Si la acción es editar hace la subida de los datos de la película editada
     * Si el nombre de la película ya existe muestra un error en el input
     * Si la subida es correcta cierra el modal y recarga la página
     */
    async checkNewMovie() {
      this.checkIfHaveValue('titulo');
      this.checkIfHaveValue('director');
      this.checkIfHaveValue('duracion');
      this.checkIfHaveValue('sinopsis');
      if (this.modTituloOk && this.modDirectorOk && this.modDuracionOk && this.modSinopsisOk) {
        if (this.action === 'edit') {
          await this.checkUpdateMovie();
          return;
        }

        const newMovieData = {
          nombre: this.tituloData,
          director: this.directorData,
          duracion: this.duracionData,
          trailer: this.trailerData,
          sinopsis: this.sinopsisData,
        }

        const formMovieData = new FormData();

        const blobMovie = new Blob([JSON.stringify(newMovieData)],
          { type: 'application/json' }
        );

        formMovieData.append('nuevaPelicula', blobMovie);
        formMovieData.append('poster', this.$refs.posterFile.files[0]);
        formMovieData.append('captura', this.$refs.capturaFile.files[0]);

        const apiUrl = import.meta.env.VITE_API_URL;

        const response = await fetch(`${apiUrl}/peliculas/archivos`, {
          method: 'POST',
          body: formMovieData,
        });
        const newMovieDataResponse = await response.json();

        if (newMovieDataResponse.codigo) {
          this.modTituloOk = false;
          return;
        }
        this.$router.go();

      } else {
        return;
      }
    },
    /**
     * Hace la subida de los datos de la película editada
     * Si el nombre de la película ya existe muestra un error en el input
     * Si la subida es correcta cierra el modal y recarga la página
     */
    async checkUpdateMovie() {
      const updatedMovieData = {
        nombre: this.tituloData,
        director: this.directorData,
        duracion: this.duracionData,
        trailer: this.trailerData,
        sinopsis: this.sinopsisData,
      }

      const formMovieData = new FormData();

      const blobMovie = new Blob([JSON.stringify(updatedMovieData)],
        { type: 'application/json' }
      );

      formMovieData.append('peliculaToUpdate', blobMovie);
      formMovieData.append('posterToUpdate', this.$refs.posterFile.files[0] ? this.$refs.posterFile.files[0] : null);
      formMovieData.append('capturaToUpdate', this.$refs.capturaFile.files[0] ? this.$refs.capturaFile.files[0] : null);

      const apiUrl = import.meta.env.VITE_API_URL;

      const response = await fetch(`${apiUrl}/peliculas?idPelicula=${this.toEdit.id}`, {
        method: 'PUT',
        body: formMovieData,
      });
      const updatedMovieDataResponse = await response.json();

      if (updatedMovieDataResponse.codigo) {
        this.modTituloOk = false;
        return;
      }

      this.$router.go();
    }
  },
  mounted() {
    if (this.action !== 'edit') {
      this.showNewImage('blank');
    } else {
      this.contador = this.sinopsisData.length;
    }
  }
}
</script>