// Panel "qué cambió" de las versiones de comparación (A y B).
// Lee los cambios de <script type="application/json" id="cambios-datos">.
(function () {
  var fuente = document.getElementById("cambios-datos");
  if (!fuente) return;
  var datos = JSON.parse(fuente.textContent);
  var reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var movil = window.matchMedia("(max-width: 719.98px)");

  function el(tag, clase, texto) {
    var n = document.createElement(tag);
    if (clase) n.className = clase;
    if (texto != null) n.textContent = texto;
    return n;
  }
  function visible(nodo) {
    var r = nodo.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && getComputedStyle(nodo).visibility !== "hidden";
  }
  // ¿El elemento (o un ancestro) es fixed/sticky? Entonces su bolita va fixed.
  function esFijo(nodo) {
    for (var n = nodo; n && n !== document.body; n = n.parentElement) {
      var p = getComputedStyle(n).position;
      if (p === "fixed" || p === "sticky") return true;
    }
    return false;
  }

  // ---------- Panel ----------
  var panel = el("aside", "cambios-panel");
  panel.setAttribute("aria-label", datos.titulo);
  var cabeza = el("div", "cambios-cabeza");
  cabeza.appendChild(el("h2", "", datos.titulo));
  var cerrar = el("button", "cambios-cerrar", "×");
  cerrar.type = "button";
  cerrar.setAttribute("aria-label", "Cerrar panel de cambios");
  cabeza.appendChild(cerrar);
  panel.appendChild(cabeza);

  var lista = el("ol", "cambios-lista");
  datos.items.forEach(function (item) {
    var li = el("li");
    li.appendChild(el("span", "cambios-num", String(item.n)));
    var texto = el("span", "cambios-texto", item.texto);
    li.appendChild(texto);
    if (item.invisible) {
      li.appendChild(el("span", "cambios-invisible", "invisible"));
    } else {
      var ver = el("button", "cambios-ver", "Ver");
      ver.type = "button";
      ver.setAttribute("aria-label", "Ver cambio " + item.n);
      ver.addEventListener("click", function () { mostrar(item, texto); });
      li.appendChild(ver);
    }
    lista.appendChild(li);
  });
  panel.appendChild(lista);

  var abrir = el("button", "cambios-abrir", "Ver cambios");
  abrir.type = "button";
  abrir.hidden = true;

  // ---------- Bolitas ----------
  var capa = el("div", "cambios-bolitas");
  capa.setAttribute("aria-hidden", "true");
  var bolitas = [];
  datos.items.forEach(function (item) {
    if (!item.sel) return;
    var destino = document.querySelector(item.sel);
    if (!destino) return;
    var b = el("span", "cambios-bolita", String(item.n));
    capa.appendChild(b);
    bolitas.push({ b: b, destino: destino });
  });

  function posicionar() {
    if (capa.hidden) return;
    var ancho = document.documentElement.clientWidth;
    bolitas.forEach(function (o) {
      if (!visible(o.destino)) { o.b.style.display = "none"; return; }
      var r = o.destino.getBoundingClientRect();
      var fijo = esFijo(o.destino);
      var x = Math.min(Math.max(r.left - 8, 4), ancho - 26);
      var y = fijo ? Math.max(r.top - 8, 4) : r.top - 8;
      if (!fijo) { x += window.scrollX; y += window.scrollY; }
      if (!fijo && y < 0) { o.b.style.display = "none"; return; }
      o.b.classList.toggle("fija", fijo);
      o.b.style.display = "";
      o.b.style.left = x + "px";
      o.b.style.top = y + "px";
    });
  }
  var pendiente = false;
  function programar() {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(function () { pendiente = false; posicionar(); });
  }

  // ---------- Ver ----------
  var resaltados = [];
  function mostrar(item, texto) {
    var destino = document.querySelector(item.sel);
    var nota = texto.querySelector(".cambios-nota");
    if (nota) nota.remove();
    if (!destino) return;
    if (item.foco) {
      destino.focus();
    } else if (!visible(destino)) {
      texto.appendChild(el("span", "cambios-nota", "No se ve en este ancho de pantalla"));
      return;
    } else {
      destino.scrollIntoView({ behavior: reducir ? "auto" : "smooth", block: movil.matches ? "start" : "center" });
    }
    if (item.reanimar && window.reanimarEntrada) window.reanimarEntrada(destino);
    destino.classList.add("cambios-resaltado");
    var t = setTimeout(function () { destino.classList.remove("cambios-resaltado"); }, 2000);
    resaltados.push(t);
  }

  // ---------- Abrir / cerrar ----------
  function setAbierto(abierto) {
    panel.hidden = !abierto;
    capa.hidden = !abierto;
    abrir.hidden = abierto;
    if (abierto) { posicionar(); cerrar.focus({ preventScroll: true }); }
    else abrir.focus({ preventScroll: true });
  }
  cerrar.addEventListener("click", function () { setAbierto(false); });
  abrir.addEventListener("click", function () { setAbierto(true); });

  document.body.appendChild(capa);
  document.body.appendChild(panel);
  document.body.appendChild(abrir);
  window.addEventListener("scroll", programar, { passive: true });
  window.addEventListener("resize", programar);
  document.addEventListener("scroll", programar, { passive: true, capture: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(programar);
  window.addEventListener("load", programar);
  posicionar();
  // Las animaciones de entrada (versión B) mueven elementos un momento.
  setTimeout(posicionar, 1200);
})();
