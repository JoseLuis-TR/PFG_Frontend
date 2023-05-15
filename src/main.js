import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createPinia } from 'pinia'
import './assets/scss/main.scss'
import App from './App.vue'
import Index from './pages/Index.vue'
import VueSplide from '@splidejs/vue-splide';

// Se definen las rutas
const routes = [
    {
        path: '/',
        name: 'Inicio',
        component: Index,
        meta: {
            title: 'Cines Haven - Inicio'
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

// Se monta la aplicación
app.mount('#app')


