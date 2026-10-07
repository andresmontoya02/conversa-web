// Login: el panel todavía no está al aire, así que nada navega.
(function () {
  var form = document.getElementById("login-form");
  var aviso = document.getElementById("login-aviso");
  var clave = document.getElementById("contrasena");
  var ojo = document.querySelector(".ojo");
  var entrar = document.querySelector(".login-entrar");
  var wa = document.querySelector(".login-wa");

  function avisar(e) {
    e.preventDefault();
    aviso.textContent = "";
    // Se vacía y se vuelve a escribir para que el lector de pantalla lo repita.
    requestAnimationFrame(function () {
      aviso.textContent = "El panel estará disponible muy pronto.";
    });
  }
  form.addEventListener("submit", avisar);
  document.getElementById("login-olvido").addEventListener("click", avisar);

  ojo.addEventListener("click", function () {
    var mostrar = clave.type === "password";
    clave.type = mostrar ? "text" : "password";
    ojo.setAttribute("aria-label", mostrar ? "Ocultar contraseña" : "Mostrar contraseña");
    ojo.querySelector(".ojo-abierto").toggleAttribute("hidden", mostrar);
    ojo.querySelector(".ojo-cerrado").toggleAttribute("hidden", !mostrar);
  });

  // El botón flotante de WhatsApp se aparta mientras el botón "Entrar"
  // pasa por debajo de él, para no taparlo.
  var pendiente = false;
  function revisar() {
    pendiente = false;
    var b = entrar.getBoundingClientRect();
    var w = wa.getBoundingClientRect();
    var m = 24;
    var choca = b.bottom > w.top - m && b.top < w.bottom + m && b.right > w.left - m && b.left < w.right + m;
    wa.classList.toggle("apartado", choca);
  }
  function programar() {
    if (!pendiente) { pendiente = true; requestAnimationFrame(revisar); }
  }
  window.addEventListener("scroll", programar, { passive: true });
  window.addEventListener("resize", programar);
  revisar();
})();
