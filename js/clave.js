/* PIN de entrada mientras la familia revisa el sitio.
   OJO: esto solo frena a visitantes casuales. No es seguridad real: el contenido
   sigue en el codigo de cada pagina. No poner aqui nada privado.
   El PIN no esta escrito aqui, solo su "huella" (SHA-256 de "corcauchos:" + PIN).
   Para cambiar el PIN, calcular la huella nueva y reemplazar HUELLA.
   AL LANZAR EL SITIO: borrar este archivo y la linea <script src="/js/clave.js"> de cada pagina. */
(function () {
  "use strict";

  var HUELLA = "4a19df1c019b00b678d99cb3a8651c4246decb8aef1c93e6b7520a261864dea8";
  var LLAVE = "corcauchos-pin";

  function guardado() {
    try { return localStorage.getItem(LLAVE); } catch (e) { return null; }
  }
  if (guardado() === HUELLA) return;

  // Esconder la pagina hasta que pongan el PIN.
  var oculto = document.createElement("style");
  oculto.textContent =
    "body > *:not(#clave) { display: none !important; }" +
    "#clave { position: fixed; inset: 0; z-index: 9999; display: grid; place-items: center; padding: 20px;" +
    "  background: #26282c; color: #fff; font-family: Archivo, 'Helvetica Neue', Arial, sans-serif; }" +
    "#clave form { width: 100%; max-width: 380px; }" +
    "#clave .clave-marca { font-weight: 900; font-stretch: 125%; font-size: 1.6rem; letter-spacing: .01em; margin: 0 0 28px; }" +
    "#clave h1 { font-size: 1.9rem; line-height: 1.1; margin: 0 0 10px; }" +
    "#clave p { color: #c9ccd1; margin: 0 0 22px; line-height: 1.5; }" +
    "#clave label { display: block; font-weight: 600; margin-bottom: 8px; }" +
    "#clave input { width: 100%; font-family: inherit; font-size: 1.6rem; font-weight: 700; letter-spacing: .3em; text-align: center; padding: 14px;" +
    "  border: 2px solid #3a3d42; border-radius: 6px; background: #18191b; color: #fff; }" +
    "#clave input:focus { outline: 3px solid #e2141f; outline-offset: 2px; }" +
    "#clave button { margin-top: 14px; width: 100%; font-family: inherit; font-size: 1.1rem; font-weight: 700; padding: 16px; border: 0; border-radius: 6px;" +
    "  background: #e2141f; color: #fff; cursor: pointer; }" +
    "#clave button:hover { background: #b80d17; }" +
    "#clave .clave-error { color: #ff9a9f; margin: 14px 0 0; min-height: 1.5em; }";
  document.head.appendChild(oculto);

  function huella(texto) {
    var datos = new TextEncoder().encode("corcauchos:" + texto);
    return crypto.subtle.digest("SHA-256", datos).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) {
        return ("0" + b.toString(16)).slice(-2);
      }).join("");
    });
  }

  function mostrar() {
    var caja = document.createElement("div");
    caja.id = "clave";
    caja.innerHTML =
      '<form novalidate>' +
      '<p class="clave-marca">CORCAUCHOS</p>' +
      '<h1>Sitio en revisión</h1>' +
      '<p>Esta página todavía no está abierta al público. Escribe el PIN que te dio la familia para entrar.</p>' +
      '<label for="clave-pin">PIN</label>' +
      '<input id="clave-pin" type="password" inputmode="numeric" autocomplete="off" maxlength="12" required>' +
      '<button type="submit">Entrar</button>' +
      '<p class="clave-error" role="alert"></p>' +
      '</form>';
    document.body.appendChild(caja);
    var form = caja.querySelector("form");
    var campo = caja.querySelector("input");
    var error = caja.querySelector(".clave-error");
    campo.focus();

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var pin = campo.value.trim();
      if (!pin) { error.textContent = "Escribe el PIN para entrar."; return; }
      huella(pin).then(function (h) {
        if (h === HUELLA) {
          try { localStorage.setItem(LLAVE, HUELLA); } catch (err) {}
          caja.remove();
          oculto.remove();
        } else {
          error.textContent = "Ese PIN no es correcto. Revísalo e intenta de nuevo.";
          campo.select();
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mostrar);
  } else {
    mostrar();
  }
})();
