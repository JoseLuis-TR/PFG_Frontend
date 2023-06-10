<template>
    <Transition name="modalBG">
        <section class="modalContainer" @click.self="$emit('close')">
            <Transition name="modal" appear>
                <article class="formContainer newMovie">
                    <section class="showImages">
                        <img class="showImages__poster" :src="posterToShow">
                        <img class="showImages__captura" :src="capturaToShow" >
                    </section>
                    <section class="inputImages">
                        <label for="poster" class="inputImages__button">
                            {{ action === 'edit' ? 'Editar' : 'Añadir' }} poster
                        </label>
                        <input
                            id="poster"
                            class="inputImages__input"
                            type="file"
                            accept="image/*"
                            :multiple="false"
                            ref="posterFile"
                            @change="(event) => handleImageUpload(event, 'poster')">
                        <label for="captura" class="inputImages__button">
                            {{ action === 'edit' ? 'Editar' : 'Añadir' }} captura
                        </label>
                        <input
                            id="captura"
                            class="inputImages__input"
                            type="file"
                            accept="image/*"
                            :multiple="false"
                            ref="capturaFile"
                            @change="(event) => handleImageUpload(event, 'captura')">
                    </section>
                    <form class="formContainer__body__form" v-on:submit.prevent="checkNewMovie()">
                        <fieldset class="formContainer__body__userDataHandler">
                            <label for="titulo">Titulo *</label>
                            <input 
                                v-model="tituloData" 
                                :class="{'input_error' : !modTituloOk}"
                                v-on:blur="checkIfHaveValue('titulo')"
                                id="titulo" 
                                type="text"
                                placeholder="Titulo de la pelicula...">
                            <label for="director">Director *</label>
                            <input 
                                v-model="directorData"
                                :class="{'input_error' : !modDirectorOk}"
                                v-on:blur="checkIfHaveValue('director')"
                                id="director" 
                                type="text"
                                placeholder="Director de la pelicula...">
                            <label for="duracion">Duración *</label>
                            <input 
                                v-model="duracionData"
                                :class="{'input_error' : !modDuracionOk}"
                                v-on:blur="checkIfHaveValue('duracion')"
                                id="duracion" 
                                maxlength="3"
                                v-on:input="checkIsANumber"
                                placeholder="Duración de la pelicula en minutos...">
                            <label for="trailer">Trailer</label>
                            <input 
                                v-model="trailerData"
                                id="trailer" 
                                placeholder="Enlace a trailer en youtube (Opcional)">
                            <label for="sinopsis">Sinopsis *</label>
                            <textarea 
                                v-model="sinopsisData"
                                @keyup="countCharacters"
                                :class="{'input_error' : !modSinopsisOk}"
                                v-on:blur="checkIfHaveValue('sinopsis')"
                                id="sinopsis" 
                                placeholder="Escriba un pequeño resumen de la pelicula...">
                            </textarea>
                            <p 
                            class="modalForm__contador"
                            :class="{'limit': contador === 750}">{{contador}}/750</p>
                        </fieldset>
                        <button>Añadir</button>
                    </form>
                </article>
            </Transition>
        </section>
    </Transition>
</template>

<script>
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
        methods:{
            handleImageUpload(event, type){
                if(event.target.files.length === 1 && event.target.files[0].type.startsWith('image/')){
                    const selectedFile = event.target.files[0];
                    const fileUrl = URL.createObjectURL(selectedFile);
                    this.errorMessage = null;
                    if(type === 'poster'){
                        this.showNewImage('poster', fileUrl);
                    } else if(type === 'captura') {
                        this.showNewImage('captura', fileUrl);
                    }
                } else {
                    this.errorMessage = 'Sólo se puede subir una imagen';
                }
            },
            showNewImage(type, fileUrl = null){
                if(type === 'poster'){
                    this.posterToShow = fileUrl;
                } else if(type === 'captura') {
                    this.capturaToShow = fileUrl;
                } else {
                    this.posterToShow = 'https://placehold.co/300x450/png?text=Poster';
                    this.capturaToShow = 'https://placehold.co/640x360/png?text=Captura';
                }
            },
            checkIsANumber(event){
                this.duracionData = event.target.value.replace(/\D/g, '');
            },
            checkIsNotEmpty(value){
                if(value.length > 0){
                    return true;
                } else {
                    return false;
                }
            },
            countCharacters(){
                if(this.sinopsisData.length > 750){
                    this.sinopsisData = this.sinopsisData.substring(0, 750);
                }
                this.contador = this.sinopsisData.length;
            },
            checkIfHaveValue(inputType){
                if(inputType === 'titulo'){
                    this.modTituloOk = this.tituloData === '' || this.tituloData === null ? false : true;
                } else if(inputType === 'director'){
                    this.modDirectorOk = this.directorData === '' || this.directorData === null ? false : true;
                } else if(inputType === 'duracion'){
                    this.modDuracionOk = this.duracionData === '' || this.duracionData === null ? false : true;
                } else if(inputType === 'sinopsis'){
                    this.modSinopsisOk = this.sinopsisData === '' || this.sinopsisData === null ? false : true;
                }
            },
            async checkNewMovie(){
                if(this.modTituloOk && this.modDirectorOk && this.modDuracionOk && this.modSinopsisOk){
                    if(this.action === 'edit'){
                        await this.checkUpdateMovie();
                        return;
                    }

                    const newMovieData ={
                        nombre: this.tituloData,
                        director: this.directorData,
                        duracion: this.duracionData,
                        trailer: this.trailerData,
                        sinopsis: this.sinopsisData,
                    }

                    const formMovieData = new FormData();

                    const blobMovie = new Blob([JSON.stringify(newMovieData)],
                        {type: 'application/json'}
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
                    this.$router.go();

                } else {
                    return;
                }
            },
            async checkUpdateMovie(){
                const updatedMovieData ={
                    nombre: this.tituloData,
                    director: this.directorData,
                    duracion: this.duracionData,
                    trailer: this.trailerData,
                    sinopsis: this.sinopsisData,
                }

                const formMovieData = new FormData();

                const blobMovie = new Blob([JSON.stringify(updatedMovieData)],
                    {type: 'application/json'}
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
                this.$router.go();
            }
        },
        mounted(){
            if(this.action !== 'edit'){
                this.showNewImage('blank');
            } else {
                this.contador = this.sinopsisData.length;
            }
        }
    }
</script>