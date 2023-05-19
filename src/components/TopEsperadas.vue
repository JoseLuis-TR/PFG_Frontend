<template>
    <section class="top">
        <h2 class="top__titulo" >Top 5 + esperadas</h2>
        <section class="top__container">
            <ul class="list">
                <li class="list__item"
                    v-for="(movie,index) in this.topMovies.slice(0,5)">
                    <p class="list__item__order">{{ index+1 }}</p>
                    <section class="list__item__info">
                        <p class="list__item__info__name">{{movie.nombre}}</p>
                        <p class="list__item__info__vote">{{movie.votos}} votos</p>
                    </section>
                </li>
            </ul>
        </section>
    </section>
</template>

<script>
    export default {
        name: "TopEsperadas",
        data() {
            return {
                topMovies: [],
                isLoading: false
            };
        },
        methods:{
            async getTopMovies() {
                const apiUrl = import.meta.env.VITE_API_URL;
                return await fetch(`${apiUrl}/peliculas/top`)
                    .then(response => response.json())
                    .then(data => {
                        this.topMovies = data;
                        console.log(this.topMovies);
                        this.isLoading = false;
                    });
            }
        },
        mounted() {
            this.isLoading = true;
            this.getTopMovies();
        },
    }
</script>