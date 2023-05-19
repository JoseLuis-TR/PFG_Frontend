<template>
    <Header></Header>
    <section class="inicio">
        <article class="inicio__superior">
            <CarteleraHoy />
            <TopEsperadas />
        </article>
        <article class="inicio__inferior">
            <CarteleraFutura />
        </article>
    </section>
</template>

<script>
import CarteleraHoy from '../components/CarteleraHoy.vue';
import CarteleraFutura from '../components/CarteleraFutura.vue';
import TopEsperadas from '../components/TopEsperadas.vue';
import Header from '../components/Header.vue'

export default{
    components: {
    Header,
    CarteleraHoy,
    CarteleraFutura,
    TopEsperadas
}
}
</script>