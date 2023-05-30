<template>
    <img class="mainDetails__img" :src="movieCapture">
    <section class="containerInfo" >
        <section class="containerInfo__poster">
            <img class="containerInfo__poster--img" :src="moviePoster">
        </section>
        <section class="containerInfo__details">
            <h1 class="containerInfo__details--title">{{ movieName }}</h1>
            <p class="containerInfo__details--director">Dirigida por: {{ movieDirector }}</p>
            <p class="containerInfo__details--duration">{{ movieDuration }} minutos</p>
        </section>
    </section>
</template>

<script>
export default {
    name: "CaptureBackground",
    props: [
        "movieCapture", 
        "movieName", 
        "moviePoster",
        "movieDirector",
        "movieDuration"
    ],
}
</script>