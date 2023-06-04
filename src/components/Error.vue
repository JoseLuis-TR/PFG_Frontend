<template>
    <section class="errorContainer">
        <p class="errorContainer__title">¡Oh no!</p>
        <p class="errorContainer__text">{{mensajeError}}</p>
        <img src="../assets/icons/sad.svg" class="errorContainer__sad" >
    </section>
</template>

<script>
    export default {
        name: "ErrorComp",
        props: ["mensajeError"]
    }
</script>