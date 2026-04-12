const proyectos = [
  {
    nombre: "Paysandú",
    ciudad: "Bogotá",
    estado: "terminado",
    progreso: 100,
    tipo: "Residencial",
    imagen: "src/Paysandú_Imagen.jpg"
  },
  {
    nombre: "Rivadaira",
    ciudad: "Bogotá",
    estado: "construccion",
    progreso: 50,
    tipo: "Residencial",
    imagen: "src/Rivadaira_Imagen.jpg"
  },
  {
    nombre: "Lavalleja",
    ciudad: "Medellín",
    estado: "terminado",
    progreso: 100,
    tipo: "Residencial",
    imagen: "src/Lavalleja_Imagen.jpg"
  },
  {
    nombre: "Tacuarembó",
    ciudad: "Medellín",
    estado: "construccion",
    progreso: 50,
    tipo: "Comercial",
    imagen: "src/Tacuarembó_Imagen.jpg"
  }
];

// Hero

function whatsapp() {
  const numero = "573245082990"; // tu número
  const mensaje =
    "Hola, quiero información sobre sus servicios de construcción";
  window.open(
    `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`,
    "_blank",
  );
}
//
servicio = document.getElementById("servicio");
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

let index = 0;
const slides = document.getElementById("slides");
const totalSlides = document.querySelectorAll(".slide");

function actualizarCarrusel() {
  slides.style.transform = `translateX(-${index * 100}%)`;

  totalSlides.forEach((slide) => slide.classList.remove("activo"));
  totalSlides[index].classList.add("activo");
}

function mover(direccion) {
  index += direccion;

  if (index < 0) index = totalSlides.length - 1;
  if (index >= totalSlides.length) index = 0;

  actualizarCarrusel();
}

function contactar() {
  alert("Te redirigiremos a contacto (puedes conectar WhatsApp aquí)");
}

// Auto-play
setInterval(() => {
  mover(1);
}, 4000);
