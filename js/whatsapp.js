// TODO: pendiente flujo de prospectos en el bot
var WHATSAPP_NUMBER = "573150940607";
var WHATSAPP_BASE = "https://wa.me/" + WHATSAPP_NUMBER;
document.querySelectorAll("[data-wa-msg]").forEach(function (el) {
  el.href = WHATSAPP_BASE + "?text=" + encodeURIComponent(el.getAttribute("data-wa-msg"));
});
