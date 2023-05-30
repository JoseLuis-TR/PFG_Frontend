import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createPinia } from 'pinia'
import './assets/scss/main.scss'
import App from './App.vue'
import Index from './pages/Index.vue'
import VueSplide from '@splidejs/vue-splide';
import MovieDetails from './pages/MovieDetails.vue'
import Catalogo from './pages/Catalogo.vue'

// Importación de Vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'dark',
    }
})

// Se definen las rutas
const routes = [
    {
        path: '/',
        name: 'Inicio',
        component: Index,
        meta: {
            title: 'Cines Haven - Inicio'
        }
    },
    {
        path: '/pelicula/:id',
        name: 'Detalles Pelicula',
        component: MovieDetails,
        meta: {
            title: 'Cines Haven - Detalles Pelicula'
        }
    },
    {
        path: '/catalogo',
        name: 'Catálogo',
        component: Catalogo,
        meta: {
            title: 'Cines Haven - Catálogo'
        }
    }
]

// Se crea el router
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// Se define el título de la página en caso de no existir
router.beforeEach((to, from) => {
    document.title = to.meta?.title ?? 'Haven'
})

// Se crea la aplicación
const app = createApp(App)

const pinia = createPinia();

// Se agregan dependencias
app.use(router)
app.use(pinia)
app.use(VueSplide)
app.use(vuetify)

// Se monta la aplicación
app.mount('#app')


