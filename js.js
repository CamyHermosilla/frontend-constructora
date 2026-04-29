var db; // Variable global para la base de datos
var proyectos; // Variable global para los proyectos
const filtroEstado = document.getElementById("filtroEstado");
const filtroCiudad = document.getElementById("filtroCiudad");
const filtroTipo = document.getElementById("filtroTipo");
const contenedorResultados = document.getElementById("resultados");

//Animación del Carrusel, selección del documento
let index = 0;
const slides = document.getElementById("slides");
const totalSlides = document.querySelectorAll(".slide");

//Filtros de proyectos
filtroEstado.addEventListener("change", filtrarProyectos);
filtroCiudad.addEventListener("change", filtrarProyectos);
filtroTipo.addEventListener("change", filtrarProyectos);

// Formulario de contacto
const servicio = document.getElementById("servicio");
const tipoProyectoDiv = document.getElementById("tipoProyectoDiv");
const areaDiv = document.getElementById("areaDiv");
const form = document.getElementById("formConstructora");
const respuesta = document.getElementById("respuesta");

async function main() {
  const SQL = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
  });

  db = new SQL.Database();

  //sentencia básica para insertar datos en la tabla de proyectos, reemplazando el const proyectos que habia antes.
  let sqlstr =
    "CREATE TABLE proyectos (id int, nombre char, ciudad char, estado char, progreso int, tipo char, imagen char); \
  INSERT INTO proyectos VALUES (0, 'Paysandú', 'Bogotá', 'terminado', 100, 'Residencial', 'src/Paysandú_Imagen.jpg'); \
  INSERT INTO proyectos VALUES (1, 'Rivadaira', 'Bogotá', 'construccion', 50, 'Residencial', 'src/Rivadaira_Imagen.jpg'); \
  INSERT INTO proyectos VALUES (2, 'Lavalleja', 'Medellín', 'terminado', 100, 'Residencial', 'src/Lavalleja_Imagen.jpg'); \
  INSERT INTO proyectos VALUES (3, 'Tacuarembó', 'Medellín', 'construccion', 50, 'Comercial', 'src/Tacuarembó_Imagen.jpg');";
  db.run(sqlstr); // Insertamos sin rgresar nada.

  const res = db.exec("SELECT * FROM proyectos");
  //res: contiene un array de resultados, cada resultado tiene una propiedad "columns" con los nombres de las columnas y una propiedad "values" con los datos en formato de array de arrays.
  proyectos = res[0].values.map((row) => {
    return {
      id: row[0],
      nombre: row[1],
      ciudad: row[2],
      estado: row[3],
      progreso: row[4],
      tipo: row[5],
      imagen: row[6],
    };
  });

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

  // Mostrar todos al inicio
  mostrarResultados(proyectos);
}

function whatsapp() {
  const numero = "573245082990"; // tu número
  const mensaje =
    "Hola, quiero información sobre sus servicios de construcción";
  window.open(
    `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`,
    "_blank",
  );
}

// //Estas funciones controlan un carrusel de imágenes y una acción de contacto.

// - actualizarCarrusel():Mueve el carrusel horizontalmente según el índice actual usando translateX.
// También actualiza la clase "activo" para resaltar el slide visible.

function actualizarCarrusel() {
  slides.style.transform = `translateX(-${index * 100}%)`;

  totalSlides.forEach((slide) => slide.classList.remove("activo"));
  totalSlides[index].classList.add("activo");
}
// - mover(direccion):
// Cambia el índice del carrusel (suma o resta según la dirección).
// Si se sale de los límites, vuelve al inicio o al final (efecto infinito).
// Luego llama a actualizarCarrusel() para reflejar el cambio.
function mover(direccion) {
  index += direccion;

  if (index < 0) index = totalSlides.length - 1;
  if (index >= totalSlides.length) index = 0;

  actualizarCarrusel();
}
// / - contactar():
// Muestra un mensaje al usuario indicando que será redirigido a contacto.
// Puede reemplazarse por un enlace real (por ejemplo, WhatsApp).
function contactar() {
  alert("Te redirigiremos a contacto (puedes conectar WhatsApp aquí)");
}

// Auto-play
setInterval(() => {
  mover(1);
}, 4000);

function filtrarProyectos() {
  const estado = filtroEstado.value;
  const ciudad = filtroCiudad.value;
  const tipo = filtroTipo.value;

  const filtrados = //tratamos con una copia de la lista de proyectos traida de la base de datos, pero podríamos usar consultas SQL
    //para actuar directamente sobre los datos SQL y traer los datos con los filtros.
    //Si borramos datos de la bd entonces debemos filtrar siempre con esos datos.
    //Aqui lo hacemos todavía con la variable JS para mantener la simplicidad, pero esta variable debe ser constantemente actualizada con los datos
    //de la bd.

    proyectos.filter((p) => {
      return (
        (!estado || p.estado === estado) &&
        (!ciudad || p.ciudad === ciudad) &&
        (!tipo || p.tipo === tipo)
      );
    });

  mostrarResultados(filtrados);
}

function mostrarResultados(lista) {
  contenedorResultados.innerHTML = "";

  // Agrupar por ciudad
  const agrupados = {};

  lista.forEach((p) => {
    if (!agrupados[p.ciudad]) {
      agrupados[p.ciudad] = [];
    }
    agrupados[p.ciudad].push(p);
  });

  // Render

  //   Este bloque recorre los proyectos agrupados por ciudad y los muestra en pantalla.
  // Primero, itera sobre cada ciudad en el objeto "agrupados", creando un título (h3)
  // con el nombre de la ciudad y agregándolo al contenedor de resultados.

  for (const ciudad in agrupados) {
    const tituloCiudad = document.createElement("h3");
    tituloCiudad.textContent = ciudad;
    contenedorResultados.appendChild(tituloCiudad);

    // Luego, por cada proyecto dentro de esa ciudad, crea un div con la clase "resultado"
    // y construye su contenido dinámicamente con innerHTML.
    agrupados[ciudad].forEach((p) => {
      const div = document.createElement("div");
      div.classList.add("resultado");

      // Se muestra la imagen, nombre, progreso y tipo del proyecto, junto con dos botones:
      // - "Editar", que llama a actualizarProyecto(id)
      // - "Eliminar", que llama a eliminarProyecto(id)
      div.innerHTML = `
  <img src="${p.imagen}" width="200"/>
  <p><strong>Nombre:</strong> ${p.nombre}</p>
  <p><strong>Estado:</strong> ${p.progreso}%</p>
  <p><strong>Tipo:</strong> ${p.tipo}</p>

  <button onclick="actualizarProyecto(${p.id})">Editar</button>
  <button onclick="eliminarProyecto(${p.id})">Eliminar</button>
`;
      // Finalmente, cada div se agrega al contenedor para ser renderizado en la interfaz.
      contenedorResultados.appendChild(div);
    });
  }
}
// //Estas funciones permiten gestionar (eliminar, actualizar y recargar) los proyectos
// almacenados en una base de datos SQLite desde una aplicación en JavaScript.

// 1. eliminarProyecto(id):
// Esta función se encarga de eliminar un proyecto específico de la base de datos
// utilizando su identificador único (id). Para ello, prepara una sentencia SQL
// de tipo DELETE con un parámetro, evitando problemas de seguridad como inyección SQL.

// Luego ejecuta la sentencia pasando el id correspondiente y libera los recursos
// utilizados con stmt.free().

// Finalmente, llama a la función recargarProyectos(), lo cual es clave, ya que permite
// actualizar la interfaz o lista de proyectos mostrada al usuario después de haber
// eliminado el registro, asegurando que los cambios se reflejen inmediatamente.
function eliminarProyecto(id) {
  const stmt = db.prepare("DELETE FROM proyectos WHERE id = ?");
  stmt.run([id]);
  stmt.free();

  recargarProyectos(); // CLAVE
}
// 2. actualizarProyecto(id):
// Esta función permite modificar el nombre de un proyecto existente. Primero,
// solicita al usuario un nuevo nombre mediante un prompt. Si el usuario cancela
// o no ingresa ningún valor, la función se detiene para evitar actualizaciones inválidas.

// Si se ingresa un nombre válido, se prepara una sentencia SQL de tipo UPDATE,
// donde se actualiza el campo "nombre" del proyecto que coincida con el id recibido.

// Es importante el orden de los parámetros en stmt.run([nuevoNombre, id]), ya que
// debe coincidir exactamente con el orden de los signos de interrogación en la consulta SQL.

// Después de ejecutar la actualización, se liberan los recursos y nuevamente se
// llama a recargarProyectos() para refrescar la información mostrada en pantalla.
function actualizarProyecto(id) {
  const nuevoNombre = prompt("Nuevo nombre:");

  if (!nuevoNombre) return;

  const stmt = db.prepare("UPDATE proyectos SET nombre = ? WHERE id = ?");
  stmt.run([nuevoNombre, id]); // ORDEN CORRECTO
  stmt.free();

  recargarProyectos(); // CLAVE
}

// 3. recargarProyectos():
// Esta función es fundamental para mantener sincronizada la interfaz con la base de datos.
// Realiza una consulta SELECT * FROM proyectos para obtener todos los registros actuales.

// El resultado se procesa transformando cada fila (row) en un objeto JavaScript
// con propiedades más descriptivas (id, nombre, ciudad, estado, progreso, tipo, imagen).
// Esto se logra utilizando map() sobre el arreglo de resultados.

// El uso de res[0]?.values asegura que el código no falle en caso de que la consulta
// no devuelva resultados.

// Finalmente, la función llama a mostrarResultados(proyectos), que se encarga de
// renderizar o mostrar los proyectos actualizados en la interfaz de usuario.

// En conjunto, estas funciones permiten implementar operaciones básicas CRUD
// (Create, Read, Update, Delete) sobre la tabla de proyectos, garantizando además
// que la vista siempre esté actualizada tras cualquier cambio en los datos.
function recargarProyectos() {
  const res = db.exec("SELECT * FROM proyectos");

  proyectos = res[0]?.values.map((row) => {
    return {
      id: row[0],
      nombre: row[1],
      ciudad: row[2],
      estado: row[3],
      progreso: row[4],
      tipo: row[5],
      imagen: row[6],
    };
  });
  mostrarResultados(proyectos);
}
//Punto de entrada.
main();

console.log(p);
