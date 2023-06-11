/**
 * Registro de un nuevo usuario
 *
 * @function registerUser
 * @param {string} nick - Nick del usuario
 * @param {string} email - Correo electrónico del usuario
 * @param {string} password - Contraseña del usuario
 * @return {boolean} True si se ha registrado correctamente, false en caso contrario
 */
export async function registerNewUser(newUser) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser),
  };

  const response = await fetch(`${apiUrl}/usuario`, options);

  const data = await response.json();

  if (data.hasOwnProperty("nick")) {
    return true;
  } else {
    return false;
  }
}

/**
 * Inicia sesión con un usuario
 *
 * @function loginUser
 * @param {string} email - Correo electrónico del usuario
 * @param {string} password - Contraseña del usuario
 * @return {object} Objeto con los datos del usuario
 **/
export async function loginUser(email, password) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      clave: password,
    }),
  };
  const response = await fetch(`${apiUrl}/usuario/login`, options);
  const data = await response.json();
  if (data.hasOwnProperty("codigo")) {
    return false;
  } else {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    const cookie = `loggedUser=${encodeURIComponent(
      data.id
    )}; expires=${expires.toUTCString()}; path=/; SameSite=None; Secure`;
    document.cookie = cookie;
    sessionStorage.setItem("loggedUser", JSON.stringify(data));
    return true;
  }
}

/**
 * Cierra la sesión del usuario
 *
 * @function logoutUser
 */
export function logoutUser() {
  const expires = new Date();
  expires.setDate(expires.getDate() - 1);
  const cookie = `loggedUser=; expires=${expires.toUTCString()}; path=/; SameSite=None; Secure`;
  document.cookie = cookie;
  sessionStorage.removeItem("loggedUser");
}

/**
 * Obtiene los datos del usuario
 *
 * @function fetchUser
 * @param {string} idUsuario - ID del usuario
 * @return {object} Objeto con los datos del usuario
 */
export async function fetchUser(idUsuario) {
  const apiUrl = import.meta.env.VITE_API_URL;

  const response = await fetch(`${apiUrl}/usuario?idUsuario=${idUsuario}`);
  const data = await response.json();

  if (data.hasOwnProperty("nick")) {
    sessionStorage.setItem("loggedUser", JSON.stringify(data));
  } else {
    return;
  }
}

/**
 * Devuelve los datos del usuario almacenados en sessionStorage o null
 *
 * @function getLoggedUser
 * @return {object} Objeto con los datos del usuario o null
 */
export function getLoggedUser() {
  const loggedUser = sessionStorage.getItem("loggedUser");
  if (loggedUser) {
    return JSON.parse(loggedUser);
  } else {
    return null;
  }
}
