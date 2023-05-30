<template>
    <section class="catalogoContainer">
        <h2 class="catalogoContainer__titulo">Catálogo</h2>
        <ul class="catalogoContainer__lista">
            <li class="catalogoContainer__lista__item"
                v-for="movie in moviesList.peliculas" >
                <div class="catalogoContainer__lista__item__container"
                    @click="seeMovieDetails(movie.id)">
                    <img
                    class="catalogoContainer__lista__item__container--img"
                    :src="movie.poster">
                    <p
                    class="catalogoContainer__lista__item__container--titulo">
                        {{ movie.nombre }}
                    </p>
                </div>
            </li>
        </ul>
        <v-pagination 
            :length="moviesList.totalPages"
            :total-visible="10"
            v-model="currentPage"
            prev-icon="ai-triangle-left-fill"
            next-icon="ai-triangle-right-fill"></v-pagination>
        <h1>Jpla</h1>
    </section>
</template>

<script>
    import CustomPrevIcon from '../assets/icons/left.svg';
    import CustomNextIcon from '../assets/icons/right.svg';
    export default {
        name: "Catalogo",
        data() {
            return {
                moviesList: [],
                page: 0,
                currentPage: 1,
                prevIcon: CustomPrevIcon,
                nextIcon: CustomNextIcon,
            }
        },
        methods: {
            async getMoviesByPage(page) {
                console.log(page)
                const apiUrl = import.meta.env.VITE_API_URL;
                return await fetch(`${apiUrl}/peliculas/page?numberPage=${page}`)
                    .then(response => response.json())
                    .then(data => {
                        this.moviesList = data;
                        console.log(this.moviesList);
                    });
            },
            seeMovieDetails(movieId){
                this.$router.push(`/pelicula/${movieId}`);
            }
        },
        mounted() {
            this.currentPage = parseInt(this.$route.query.page) || 1;
            console.log(this.currentPage);
            this.getMoviesByPage(this.currentPage-1);
        },
        watch:{
            currentPage: function (val) {
                this.$router.push('/catalogo?page=' + val);
            },
            $route() {
                this.currentPage = parseInt(this.$route.query.page) || 1;
                console.log(this.currentPage);
                this.getMoviesByPage(this.currentPage-1);
            }
        }
    }
</script>