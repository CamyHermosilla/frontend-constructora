const servicio = document.getElementById("servicio");
const tipoProyectoDiv = document.getElementById("tipoProyectoDiv");
const areaDiv = document.getElementById("areaDiv");
const form = document.getElementById("formConstructora");
const respuesta = document.getElementById("respuesta");

// Mostrar campos según selección
servicio.addEventListener("change", function () {
  if (this.value === "construccion" || this.value === "remodelacion") {
    tipoProyectoDiv.classList.remove("hidden");
    areaDiv.classList.remove("hidden");
  } else {
    tipoProyectoDiv.classList.add("hidden");
    areaDiv.classList.add("hidden");
  }
});

// Validación y lógica de envío
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("correo").value;
  const servicioValor = servicio.value;
  const area = document.getElementById("area").value;

  // Condición de negocio
  if (servicioValor === "construccion" && area < 50) {
    respuesta.innerHTML =
      "⚠️ Para proyectos de construcción, el área mínima es de 50 m².";
    respuesta.style.color = "red";
    return;
  }

  // Mensaje personalizado
  if (servicioValor === "cotizacion") {
    respuesta.innerHTML = "✅ Te contactaremos pronto para tu cotización.";
  } else {
    respuesta.innerHTML =
      "✅ Gracias por tu interés. Un asesor se comunicará contigo.";
  }

  respuesta.style.color = "green";

  form.reset();
  tipoProyectoDiv.classList.add("hidden");
  areaDiv.classList.add("hidden");
});
