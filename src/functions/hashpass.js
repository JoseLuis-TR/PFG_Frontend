import CryptoJS from "crypto-js";
/**
 * @module Functions_PassOperations
 */

/**
 * Encripta la contraseña utilizando sha1
 *
 * @memberof module:Functions_PassOperations
 * @function
 * @param {string} password Contraseña a encriptar
 * @return {string} Contraseña encriptada
 */
const encriptarPass = (password) => {
  const encryptedPass = CryptoJS.SHA256(password).toString();
  return encryptedPass;
};

export { encriptarPass };
