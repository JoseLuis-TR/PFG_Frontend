import CryptoJS from "crypto-js";
/**
 * @module _Functions/PassOperations
 */

/**
 * Encripta la contraseña utilizando sha256
 *
 * @memberof module:_Functions/PassOperations
 * @function
 * @param {string} password Contraseña a encriptar
 * @return {string} Contraseña encriptada
 */
const encriptarPass = (password) => {
  const encryptedPass = CryptoJS.SHA256(password).toString();
  return encryptedPass;
};

export { encriptarPass };
