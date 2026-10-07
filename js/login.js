// El panel todavía no está al aire: el formulario no envía ni navega.
document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();
  document.getElementById("login-aviso").textContent = "El panel estará disponible muy pronto.";
});
