<template>
    <section class="vote">
        <p class="vote__title">¡Oh no!</p>
        <p class="vote__explain">
            Actualmente no hay programadas nuevas sesiones para esta pelicula, pero puedes votar para que vuelva a cartelera.
            <br>
            <br>
            Contra más votos... ¡más posibilidades de que vuelva!
        </p>
        <button class="vote__button" @click="castVote" v-if="!isVoted">
            <img src="../../assets/icons/like.svg" alt="like">
            Votar
        </button>
        <Transition name="fade">
            <p class="vote__voted" v-if="isVoted">
                ¡Gracias por tu voto! <br>
                Votos actuales: {{ movieData.votos }}
            </p>
        </Transition>
    </section>
</template>

<script>
    export default {
        name: "VotoPelicula",
        data(){
            return {
                movieData: {},
                isVoted: false
            }
        },
        methods: {
            async castVote(){
                const apiUrl = import.meta.env.VITE_API_URL;
                const options = {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                const response = await fetch(`${apiUrl}/peliculas/voto?idPelicula=${this.$route.params.id}`, options);
                this.movieData = await response.json();
                this.isVoted = true;
            }
        },
    }
</script>