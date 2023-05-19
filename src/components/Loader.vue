<template>
    <p class="loader__text">
        {{ mensajeCarga }}
    </p>
    <img class="loader__img" src="../assets/images/tail-spin.svg">
</template>

<script>
export default{
    name: "Loader",
    props: ["mensajeCarga"]
}
</script>