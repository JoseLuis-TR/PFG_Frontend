<template>
    <section class="carteleraHoy">
        <h2 class="carteleraHoy__titulo">Hoy en cartelera</h2>
        <section class="loader" v-if="isLoading">
            <Loader mensajeCarga="Cargando" />
        </section>
        <Splide
            :options="slideOptions"
            class="carteleraHoy__splide"
            v-else-if="!isLoading && this.movies.length > 0">
            <SplideSlide 
                class="carteleraHoy__splide__slide"
                v-for="(movie, index) in this.movies"
                :key="index"
                @click="redirectToMoviePage(movie.id)">
                    <img :src="movie.peliculaCartelera.captura" >
                    <section class="movieInfo">
                        <p class="movieInfo__titulo">{{movie.peliculaCartelera.nombre}}</p>
                    </section>
            </SplideSlide>
        </Splide>
        <section v-else>
            <p>No hay películas en cartelera</p>
        </section>
    </section>
</template>

<script>
import { Splide } from '@splidejs/vue-splide';
import Loader from './Loader.vue';

export default{
    name: "CarteleraHoy",
    components: { Loader },
    data() {
        return {
            movies: [],
            isLoading: false,
            slideOptions: {
                type: 'loop',
                arrows: false, 
                cover: true, 
                autoplay: true, 
                interval: 3000
            }
        };
    },
    mounted() {
        this.isLoading = true;
        this.getTodaySessions();
    },
    methods: {
        async getTodaySessions() {
            const apiUrl = import.meta.env.VITE_API_URL;
            return await fetch(`${apiUrl}/sesiones/hoy`)
                .then(response => response.json())
                .then(data => {
                this.movies = data;
                console.log(this.movies);
                this.isLoading = false;
            });
        },
        redirectToMoviePage(movieId) {
            console.log(movieId)
        }
    },
    components: { Splide, Loader }
}
</script>
