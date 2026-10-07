// 11. Fade-up al entrar en pantalla. Respeta prefers-reduced-motion
// y no oculta nada si el navegador no tiene IntersectionObserver.
(function () {
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var grupos = [".hero-copy", ".escena", ".cabeza", ".agentes > *", ".carrusel > *", ".bloque"];
  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observador.unobserve(e.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

  document.documentElement.classList.add("revelar-on");
  grupos.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el, i) {
      el.classList.add("revelar");
      el.style.setProperty("--i", i);
      observador.observe(el);
    });
  });

  // El panel de cambios usa esto para repetir la animación de un bloque.
  window.reanimarEntrada = function (raiz) {
    var els = [raiz].concat([].slice.call(raiz.querySelectorAll(".revelar")))
      .filter(function (el) { return el.classList.contains("revelar"); });
    els.forEach(function (el) { el.classList.remove("visible"); });
    void raiz.offsetWidth;
    setTimeout(function () {
      els.forEach(function (el) { el.classList.add("visible"); });
    }, 350);
  };
})();
