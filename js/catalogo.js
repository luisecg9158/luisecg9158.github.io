/* Catalogo de Corcauchos C.A.
   Lee data/catalogo.json y muestra los productos.
   Si el archivo no carga o no tiene productos, se queda el mensaje con el boton de WhatsApp. */
(function () {
  "use strict";

  // Configuracion. Cambiar a true solo si la familia decide mostrar el precio al mayor.
  var MOSTRAR_PRECIO_MAYOR = false;
  var ARCHIVO = "data/catalogo.json";
  var WA = "https://wa.me/584145731823?text=";

  var lista, vacio, controles, actualizado, buscador;
  var productos = [];
  var moneda = "USD";
  var filtro = "todos";

  var VEHICULOS = { carro: "Carro", camioneta: "Camioneta", camion: "Camión" };

  function precioTexto(valor) {
    if (typeof valor !== "number" || !(valor > 0)) return "Consulta el precio";
    var n = valor.toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return moneda === "Bs" ? "Bs " + n : "$" + n;
  }

  function enlaceProducto(p) {
    var producto = encodeURIComponent(p.nombre + " " + p.medida);
    return WA + "Hola%20Corcauchos%2C%20me%20interesa%3A%20" + producto + ".%20%C2%BFEst%C3%A1%20disponible%3F";
  }

  function el(tag, clase, texto) {
    var e = document.createElement(tag);
    if (clase) e.className = clase;
    if (texto) e.textContent = texto;
    return e;
  }

  function tarjeta(p) {
    var li = el("li", "producto");
    if (p.foto) {
      var img = el("img");
      img.src = p.foto;
      img.alt = p.nombre;
      img.loading = "lazy";
      img.width = 400;
      img.height = 300;
      li.appendChild(img);
    }
    if (!p.disponible) li.appendChild(el("span", "agotado", "Agotado"));
    li.appendChild(el("h3", "", p.nombre));
    if (p.medida) li.appendChild(el("p", "", "Medida: " + p.medida));
    if (VEHICULOS[p.vehiculo]) li.appendChild(el("p", "", "Para: " + VEHICULOS[p.vehiculo]));
    li.appendChild(el("p", "precio", precioTexto(p.precio)));
    if (MOSTRAR_PRECIO_MAYOR && typeof p.precio_mayor === "number" && p.precio_mayor > 0) {
      li.appendChild(el("p", "", "Al mayor: " + precioTexto(p.precio_mayor)));
    }
    var a = el("a", "boton boton-wa", p.disponible ? "Lo quiero" : "Avísame cuando llegue");
    a.href = enlaceProducto(p);
    li.appendChild(a);
    return li;
  }

  function mostrar() {
    var q = (buscador.value || "").toLowerCase().replace(/\s+/g, " ").trim();
    lista.textContent = "";
    var hay = 0;
    productos.forEach(function (p) {
      if (filtro !== "todos" && p.tipo !== filtro) return;
      if (q) {
        var texto = [p.nombre, p.marca, p.medida].join(" ").toLowerCase();
        if (texto.indexOf(q) === -1) return;
      }
      lista.appendChild(tarjeta(p));
      hay++;
    });
    if (!hay) lista.appendChild(el("li", "producto", "No encontramos ese producto en el catálogo. Escríbenos por WhatsApp y te decimos si lo tenemos."));
  }

  function fechaBonita(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    if (!m) return "";
    var meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    return Number(m[3]) + " de " + meses[Number(m[2]) - 1] + " de " + m[1];
  }

  function iniciar(datos) {
    moneda = datos.moneda === "Bs" ? "Bs" : "USD";
    productos = (datos.productos || []).filter(function (p) {
      // Las filas de ejemplo nunca se muestran.
      return p && p.id && String(p.id).indexOf("EJEMPLO") !== 0 && p.nombre;
    });
    if (!productos.length) return;

    // Hay productos reales: se muestran la seccion y su enlace en el menu.
    var seccion = document.getElementById("catalogo");
    var enlaceMenu = document.getElementById("nav-catalogo");
    if (seccion) seccion.hidden = false;
    if (enlaceMenu) enlaceMenu.hidden = false;

    // Destacados primero, agotados al final.
    productos.sort(function (a, b) {
      var da = a.disponible ? 0 : 2, db = b.disponible ? 0 : 2;
      da += a.destacado ? 0 : 1;
      db += b.destacado ? 0 : 1;
      return da - db;
    });

    vacio.hidden = true;
    controles.hidden = false;
    var fecha = fechaBonita(datos.actualizado);
    if (fecha) {
      actualizado.textContent = "Actualizado el " + fecha + ".";
      actualizado.hidden = false;
    }

    controles.addEventListener("click", function (e) {
      var b = e.target.closest("[data-filtro]");
      if (!b) return;
      filtro = b.getAttribute("data-filtro");
      controles.querySelectorAll("[data-filtro]").forEach(function (x) {
        x.setAttribute("aria-pressed", x === b ? "true" : "false");
      });
      mostrar();
    });
    buscador.addEventListener("input", mostrar);
    mostrar();
  }

  document.addEventListener("DOMContentLoaded", function () {
    lista = document.getElementById("catalogo-lista");
    vacio = document.getElementById("catalogo-vacio");
    controles = document.getElementById("catalogo-controles");
    actualizado = document.getElementById("catalogo-actualizado");
    buscador = document.getElementById("buscar");
    if (!lista || !window.fetch) return;

    fetch(ARCHIVO, { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(iniciar)
      .catch(function () { /* Se queda el mensaje de catalogo vacio. */ });
  });
})();
