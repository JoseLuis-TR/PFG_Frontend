<template>
    <section class="infoContainer">
        <h2 class="infoContainer__title">Sinopsis y trailer</h2>
        <span class="infoContainer__divider"></span>
        <p class="infoContainer__sinopsis">
            {{ movieData.sinopsis }}
        </p>
        <div class="videoContainer">
            <iframe 
            v-if="youtubeUrl"
            class="videoContainer__video"
            :src="`https://www.youtube.com/embed/${youtubeUrl}`" 
            frameborder="0" 
            allowfullscreen></iframe>
            <ErrorComp 
            v-else 
            mensajeError="No hay trailer disponible para esta película"
        />
        </div>
    </section>
</template>

<script>
import ErrorComp from "../Error.vue";

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
        async getMovieDetails(movieId){
        const apiUrl = import.meta.env.VITE_API_URL;
        return await fetch(`${apiUrl}/peliculas?idPelicula=${movieId}`)
            .then(response => response.json())
            .then(data => {
                this.movieData = data;
                this.isLoading = false;
                });
        },
        extractYoutubeId(url){
            if(!url) this.urlIsCorrect = false;
            if(url.length == 11) this.youtubeUrl = url;

            let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
            let match = url.match(regExp);
            return (match&&match[7].length==11)? match[7] : false;
        }
    },
    async mounted() {
        await this.getMovieDetails(this.$route.params.id);
        this.youtubeUrl = this.extractYoutubeId(this.movieData.trailer);
    }
}
</script>