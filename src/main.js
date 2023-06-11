import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import "./assets/scss/main.scss";
import App from "./App.vue";
import Index from "./pages/Index.vue";
import VueSplide from "@splidejs/vue-splide";
import MovieDetails from "./pages/MovieDetails.vue";
import Catalogo from "./pages/Catalogo.vue";
import { fetchUser } from "./store/user.js";

// Importación de Vuetify
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "dark",
  },
});

// Se definen las rutas
const routes = [
  {
    path: "/",
    name: "Inicio",
    component: Index,
    meta: {
      title: "Cines Haven - Inicio",
    },
  },
  {
    path: "/pelicula/:id",
    name: "Detalles Pelicula",
    component: MovieDetails,
    meta: {
      title: "Cines Haven - Detalles Pelicula",
    },
  },
  {
    path: "/catalogo",
    name: "Catálogo",
    component: Catalogo,
    meta: {
      title: "Cines Haven - Catálogo",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

// Se crea el router
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// Se define el título de la página en caso de no existir
router.beforeEach((to, from) => {
  document.title = to.meta?.title ?? "Haven";
});

// Se crea la aplicación
const app = createApp(App);

// Se agregan dependencias
app.use(router);
app.use(VueSplide);
app.use(vuetify);

app.config.globalProperties.$fetchUserOnStart = async () => {
  const cookies = document.cookie.split(";");
  let userID;
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    const [cookieKey, cookieValue] = cookie.split("=");
    if (cookieKey === "loggedUser") {
      userID = decodeURIComponent(cookieValue);
      break;
    }
  }
  if (userID) {
    await fetchUser(userID);
  }
};

// Se comprueba si hay un usuario en las cookies
// Y se inicia la app con los datos del usuario
app.config.globalProperties.$fetchUserOnStart().then(() => {
  app.mount("#app");
});
