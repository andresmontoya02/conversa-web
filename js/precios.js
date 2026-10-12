// Calculadora de precios de andi.html (#precios).
// Los precios viven SOLO aquí; las tarjetas del HTML deben coincidir.
const PLANES = [
  { max: 15, precio: 149900, nombre: "1 a 15" },
  { max: 30, precio: 219900, nombre: "16 a 30" },
  { max: 50, precio: 299900, nombre: "31 a 50" }
];
const EXTRA_POR_EMPLEADO = 20000;

// "$" + miles con punto, sin depender de la configuración regional.
function formatoPesos(valor) {
  return "$" + String(Math.round(valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Devuelve { precio, detalle } para n empleados. n > 50 es "más de 50".
function calcularPrecio(n) {
  var tope = PLANES[PLANES.length - 1].max;
  if (n > tope) {
    return {
      precio: "A la medida",
      detalle: "Con más de " + tope + " empleados armamos el precio contigo por WhatsApp."
    };
  }
  var i = 0;
  while (n > PLANES[i].max) i++;
  var plan = PLANES[i];
  if (i === 0) {
    return { precio: formatoPesos(plan.precio), detalle: "Plan de " + plan.nombre + " empleados." };
  }
  var anterior = PLANES[i - 1];
  var extras = n - anterior.max;
  var alt = anterior.precio + EXTRA_POR_EMPLEADO * extras;
  if (alt < plan.precio) {
    return {
      precio: formatoPesos(alt),
      detalle: "Plan de " + anterior.nombre + " empleados + " + extras +
        (extras === 1 ? " empleado extra" : " empleados extra") +
        " a " + formatoPesos(EXTRA_POR_EMPLEADO) + " cada uno."
    };
  }
  return {
    precio: formatoPesos(plan.precio),
    detalle: "Ya te conviene el plan de " + plan.nombre + " empleados: no pagas extras."
  };
}

(function () {
  var rango = document.getElementById("calc-empleados");
  if (!rango) return;
  var etiqueta = document.getElementById("calc-n");
  var precio = document.getElementById("calc-precio");
  var detalle = document.getElementById("calc-detalle");
  var tope = PLANES[PLANES.length - 1].max;

  function actualizar() {
    var n = parseInt(rango.value, 10);
    var texto = n > tope ? "más de " + tope : String(n);
    var r = calcularPrecio(n);
    etiqueta.textContent = texto;
    rango.setAttribute("aria-valuetext", texto + " empleados");
    precio.textContent = r.precio;
    detalle.textContent = r.detalle;
  }

  rango.addEventListener("input", actualizar);
  actualizar();
})();
