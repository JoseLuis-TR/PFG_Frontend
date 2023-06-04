<template>
    <section class="ticketContainer" v-if="true">
        <CarteleraMovieDetails/>
    </section>
</template>

<script>
    import CarteleraMovieDetails from '../Cartelera/CarteleraMovieDetails.vue';

    export default {
        name: "ticketMovie",
        components: { CarteleraMovieDetails },
        props: [
            "sessions"
        ]
    }
    // TODO - Añadir cuando no haya 
</script>
