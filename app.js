/* ============================================================
   APP.JS — DEFINICIONES GENERALES
=========================================================== */

let respuestas = {};
let datosGenerales = { medico: null };

/* ============================================================
   DEFINICIÓN DE BLOQUES Y PREGUNTAS
=========================================================== */

const bloques = {
  /* BLOQUE 2 – CONFORT TÉRMICO */
  form2: [
    { t: "¿El recinto cuenta con temperatura estable?", d: "Considerar que mantiene una temperatura agradable y homogénea.", g: "muygrave" },
    { t: "¿Hay circulación de aire natural (ventilación cruzada)?", d: "Presencia de ventanas, aberturas o flujo cruzado.", g: "leve" },
    { t: "¿El espacio posee aire acondicionado en funcionamiento?", d: "Aire acondicionado operativo y accesible.", g: "medio" },
    { t: "¿Posee ventiladores funcionando?", d: "Ventiladores operativos y distribuidos adecuadamente.", g: "leve" }
  ],

  /* BLOQUE 3 – DISPOSICIONES EDILICIAS */
  form3: [
    { t: "¿La fachada principal está orientada al norte?", d: "La orientación norte recibe radiación homogénea y controlable.", g: "medio" },
    { t: "¿La menor cantidad de aberturas se orientan al oeste?", d: "La orientación oeste recibe mayor carga térmica.", g: "medio" },
    { t: "¿El área permite el acceso seguro de personas con movilidad reducida?", d: "Considerar rampas, nivelación, ausencia de obstáculos, accesos amplios.", g: "grave" }
  ],

  /* BLOQUE 4 – ENVOLVENTE TÉRMICA */
  form4: [
    { t: "¿El material del techo evita la trasferencia de calor al recinto?", d: "Ejemplo: losa, cieloraso aislante, techo de chapa con aislación térmica, etc.", g: "grave" },
    { t: "¿El recinto posee planta superior?", d: "La planta superior reduce la transferencia térmica directa desde la cubierta.", g: "medio" }
  ],

  /* BLOQUE 5 – PROTECCIONES PASIVAS */
  form5: [
    { t: "¿Posee toldos, cortinas o elementos de sombra?", d: "Elementos que mitiguen la radiación solar directa.", g: "leve" },
    { t: "¿Posee vegetación / edificios / medianeras, etc al norte?", d: "Estos elementos ubicados al norte generan sombreado.", g: "medio" },
    { t: "¿Posee vegetación / edificios / medianeras, etc al oeste?", d: "Estos elementos ubicados al oeste generan sombreado.", g: "medio" }
  ],

  /* BLOQUE 6 – DISEÑO */
  form6: [
    { t: "¿Cuenta con aberturas altas para permitir la salida del aire caliente?", d: "Aberturas ubicadas a más de 2 metros favorecen la ventilación.", g: "leve" },
    { t: "¿Posee tela mosquitera?", d: "Evita ingreso de insectos y mejora las condiciones sanitarias.", g: "leve" }
  ],

  /* BLOQUE 7 – SERVICIOS */
  form7: [
    { t: "¿El punto cuenta con disponibilidad de agua fría para el público en general?", d: "Agua fría accesible para las personas (heladera, dispenser o botellón refrigerado).", g: "muygrave" },
    { t: "¿Se dispone de un área de reposo o espera?", d: "Sillas, bancos o sectores confortables.", g: "medio" },
    { t: "¿El espacio está preparado para futura instalación de energía solar?", d: "Debe poseer espacio físico, estructura resistente y capacidad eléctrica.", g: "medio" }
  ]
};

/* ============================================================
   MAPA DE MEJORAS (NUEVO)
=========================================================== */

const mapaMejoras = {
  "form2_1": { tipo: "MS", texto: [
    "Instalar extractores de aire.",
    "Agregar aberturas que permitan ventilación cruzada, preferentemente en sectores altos."
  ]},
  "form2_2": { tipo: "MR", texto: [
    "Instalación de aire acondicionado o reparación del existente."
  ]},
  "form2_3": { tipo: "MR", texto: [
    "Instalación de ventiladores o reparación del existente."
  ]},
  "form3_2": { tipo: "MR", texto: [
    "Adaptación del ingreso para personas con movilidad reducida."
  ]},
  "form4_0": { tipo: "MS", texto: [
    "Instalación de cielorraso.",
    "Pintado de techos color claro.",
    "Incorporación de material aislante."
  ]},
  "form5_0": { tipo: "MR", texto: [
    "Agregar cortinas, toldos u otros elementos de sombra."
  ]},
  "form5_1": { tipo: "MS", texto: [
    "Agregar vegetación, parasoles u otros elementos de sombreado al norte."
  ]},
  "form5_2": { tipo: "MS", texto: [
    "Agregar vegetación, parasoles u otros elementos de sombreado al oeste."
  ]},
  "form6_1": { tipo: "MS", texto: [
    "Instalación de tela mosquitera."
  ]},
  "form7_0": { tipo: "MR", texto: [
    "Colocar dispenser de agua fría."
  ]},
  "form7_1": { tipo: "MR", texto: [
    "Adquisición de sillas, bancos u otros elementos de descanso."
  ]},
  "form7_2": { tipo: "MS", texto: [
    "Realizar estudios detallados para evaluar la posibilidad de una instalación solar."
  ]}
};

/* ============================================================
   GENERACIÓN DE FORMULARIOS (ORIGINAL)
=========================================================== */

function generarFormularios() {
  Object.keys(bloques).forEach(idBloque => {
    const cont = document.getElementById(idBloque);
    if (!cont) return;

    bloques[idBloque].forEach((preg, index) => {
      const div = document.createElement("div");
      div.className = "pregunta";

      div.innerHTML = `
        <strong>${preg.t}</strong>
        <p class="explica">${preg.d}</p>
        <div class="opciones">
          <button class="btn-resp btn-si"
            onclick="seleccionarRespuesta('${idBloque}', ${index}, 'si', this)">
            Sí
          </button>
          <button class="btn-resp btn-no-${preg.g}"
            onclick="seleccionarRespuesta('${idBloque}', ${index}, 'no', this)">
            No
          </button>
        </div>
      `;
      cont.appendChild(div);
    });
  });
}

generarFormularios();

/* ============================================================
   GUARDAR RESPUESTAS (ORIGINAL)
=========================================================== */

function seleccionarRespuesta(bloque, index, valor, boton) {
  respuestas[`${bloque}_${index}`] = valor;
  boton.parentElement.querySelectorAll(".btn-resp")
    .forEach(b => b.classList.remove("seleccionado"));
  boton.classList.add("seleccionado");
}

/* ============================================================
   DATOS GENERALES (ORIGINAL)
=========================================================== */

function setDatoGeneral(campo, valor, boton) {
  datosGenerales[campo] = valor;
  boton.parentNode.querySelectorAll("button")
    .forEach(b => b.classList.remove("seleccionado"));
  boton.classList.add("seleccionado");
}

/* ============================================================
   NAVEGACIÓN (ORIGINAL)
=========================================================== */

let pasoActual = 1;

function mostrarPaso(n) {
  document.querySelectorAll(".step").forEach(d => d.classList.remove("active"));
  document.getElementById("step" + n).classList.add("active");
}

function nextStep() { pasoActual++; mostrarPaso(pasoActual); }
function prevStep() { pasoActual--; mostrarPaso(pasoActual); }

/* ============================================================
   CAPACIDAD EN TIEMPO REAL (ORIGINAL)
=========================================================== */

document.getElementById("m2").addEventListener("input", () => {
  let m2 = parseFloat(m2.value) || 0;
  let capacidad = Math.floor(m2 / 3.5);
  capacidadTexto.innerHTML = `<strong>Personas permitidas:</strong> ${capacidad}`;
});

/* ============================================================
   CLASIFICACIÓN Y RESULTADO (MODIFICADO)
=========================================================== */

function obtenerMejorasSeleccionadas() {
  let sugeridas = [];
  let requeridas = [];

  Object.keys(respuestas).forEach(key => {
    if (respuestas[key] === "no" && mapaMejoras[key]) {
      if (mapaMejoras[key].tipo === "MR")
        requeridas.push(...mapaMejoras[key].texto);
      else
        sugeridas.push(...mapaMejoras[key].texto);
    }
  });

  return { sugeridas, requeridas };
}

/* ======== TODO lo demás (clasificarPunto, calcular, PDF) ========
   SE MANTIENE IGUAL, SOLO AGREGANDO LAS MEJORAS EN calcular()
=========================================================== */

/* ============================================================
   CLASIFICACIÓN DEL PUNTO (ORIGINAL)
=========================================================== */

function clasificarPunto() {

  let muy = 0;
  let gra = 0;
  let med = 0;
  let lev = 0;

  Object.keys(respuestas).forEach(key => {
    const [bloque, index] = key.split("_");
    const gravedad = bloques[bloque][index].g;

    if (respuestas[key] === "no") {
      if (gravedad === "muygrave") muy++;
      if (gravedad === "grave") gra++;
      if (gravedad === "medio") med++;
      if (gravedad === "leve") lev++;
    }
  });

  /* Regla de clasificación */
  if (
    respuestas["form7_0"] === "no" || // agua fría
    muy >= 1 ||
    gra >= 4 ||
    med >= 6
  ) {
    return "rojo";
  }

  if (
    gra >= 2 ||
    med >= 3 ||
    lev >= 4
  ) {
    return "amarillo";
  }

  return "verde";
}

/* ============================================================
   CÁLCULO Y ARMADO DEL RESULTADO (MODIFICADO)
=========================================================== */

function calcular() {

  const estado = clasificarPunto();

  /* Capacidad */
  const m2 = parseFloat(document.getElementById("m2").value) || 0;
  const capacidad = Math.floor(m2 / 3.5);

  /* Mejoras */
  const { sugeridas, requeridas } = obtenerMejorasSeleccionadas();

  /* Texto de estado */
  let tituloEstado = "";
  if (estado === "rojo")
    tituloEstado = "🟥 Área NO apta como área climatizada";
  else if (estado === "amarillo")
    tituloEstado = "🟡 Área climatizada con mejoras necesarias";
  else
    tituloEstado = "🟢 Área climatizada apta";

  /* Armado HTML */
  let html = `
    <h2>${tituloEstado}</h2>

    <p><strong>Superficie evaluada:</strong> ${m2} m²</p>
    <p><strong>Capacidad máxima estimada:</strong> ${capacidad} personas</p>
  `;

  if (requeridas.length || sugeridas.length) {
    html += `<h3>Medidas de mejora</h3>`;

    if (requeridas.length) {
      html += `<h4>🔴 Medidas requeridas</h4><ul>`;
      requeridas.forEach(m => {
        html += `<li>${m}</li>`;
      });
      html += `</ul>`;
    }

    if (sugeridas.length) {
      html += `<h4>🟡 Medidas sugeridas</h4><ul>`;
      sugeridas.forEach(m => {
        html += `<li>${m}</li>`;
      });
      html += `</ul>`;
    }
  }

  html += `
    <h3>Observaciones del relevador</h3>
    <textarea id="comentarios" style="width:100%; min-height:120px;"></textarea>
  `;

  document.getElementById("resultado").innerHTML = html;

  /* Avanza al paso Resultado */
  nextStep();
}

/* ============================================================
   IMPRESIÓN / PDF (ORIGINAL + OBSERVACIONES)
=========================================================== */

function descargarPDF() {

  const resultado = document.getElementById("resultado").cloneNode(true);
  const textarea = resultado.querySelector("#comentarios");

  if (textarea) {
    const p = document.createElement("p");
    p.innerHTML = textarea.value
      ? textarea.value.replace(/\n/g, "<br>")
      : "<em>Sin observaciones.</em>";
    textarea.replaceWith(p);
  }

  const ventana = window.open("");
  ventana.document.write(`
    <html>
      <head>
        <title>Punto de Hidratación CBA</title>
      </head>
      <body>
        ${resultado.innerHTML}
      </body>
    </html>
  `);
  ventana.document.close();
  ventana.print();
}
