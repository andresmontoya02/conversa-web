// Nav de celular (andi.html, < 768px): círculo con la C que se despliega a
// píldora con "Conversa" e "Iniciar sesión". Se cierra al tocar la C otra vez
// o al bajar más de 40px; en cada cierre la C da una vuelta (+360°).
// En escritorio .nav-c no se ve, así que nada de esto tiene efecto.
(function () {
  var nav = document.getElementById("navC");
  if (!nav) return;
  var boton = nav.querySelector(".nav-c-boton");
  var panel = nav.querySelector(".nav-c-panel");
  var enlaces = panel.querySelectorAll("a");
  var reducido = window.matchMedia("(prefers-reduced-motion: reduce)");

  var abierta = false;
  var giro = 0;
  var ignorarHasta = 0; // mientras dura el scroll suave hacia arriba
  var base = 0;         // scroll más alto (menor Y) visto con la píldora abierta

  function poner(estado) {
    abierta = estado;
    nav.classList.toggle("abierta", estado);
    boton.setAttribute("aria-expanded", String(estado));
    panel.setAttribute("aria-hidden", String(!estado));
    enlaces.forEach(function (a) {
      if (estado) a.removeAttribute("tabindex");
      else a.setAttribute("tabindex", "-1");
    });
  }

  function abrir() {
    base = window.scrollY;
    if (window.scrollY > 0) {
      ignorarHasta = Date.now() + 600;
      window.scrollTo({ top: 0, behavior: reducido.matches ? "auto" : "smooth" });
    }
    poner(true);
  }

  function cerrar() {
    if (!abierta) return;
    if (!reducido.matches) {
      giro += 360;
      nav.style.setProperty("--giro", giro + "deg");
    }
    poner(false);
  }

  boton.addEventListener("click", function () {
    if (abierta) cerrar();
    else abrir();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && abierta) {
      cerrar();
      boton.focus();
    }
  });

  window.addEventListener("scroll", function () {
    if (!abierta) return;
    var y = window.scrollY;
    // Mientras sube (scroll suave o el usuario) la base sigue al scroll:
    // solo cuenta lo que se baja desde el punto más alto.
    if (y < base) base = y;
    if (Date.now() < ignorarHasta) return;
    if (y - base > 40) cerrar();
  }, { passive: true });
})();
