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
    { t: "¿El material del techo evita la transferencia de calor al recinto?", d: "Ejemplo: losa, cielorraso aislante, techo de chapa con aislación térmica.", g: "grave" },
    { t: "¿El recinto posee planta superior?", d: "La planta superior reduce la transferencia térmica directa.", g: "medio" }
  ],

  /* BLOQUE 5 – PROTECCIONES PASIVAS */
  form5: [
    { t: "¿Posee toldos, cortinas o elementos de sombra?", d: "Elementos que mitiguen la radiación solar directa.", g: "leve" },
    { t: "¿Posee vegetación / edificios / medianeras al norte?", d: "Elementos que generan sombreado.", g: "medio" },
    { t: "¿Posee vegetación / edificios / medianeras al oeste?", d: "Elementos que generan sombreado.", g: "medio" }
  ],

  /* BLOQUE 6 – DISEÑO */
  form6: [
    { t: "¿Cuenta con aberturas altas para permitir la salida del aire caliente?", d: "Aberturas a más de 2 m favorecen la ventilación.", g: "leve" },
    { t: "¿Posee tela mosquitera?", d: "Evita ingreso de insectos.", g: "leve" }
  ],

  /* BLOQUE 7 – SERVICIOS */
  form7: [
    { t: "¿El punto cuenta con disponibilidad de agua fría para el público?", d: "Heladera, dispenser o botellón refrigerado.", g: "muygrave" },
    { t: "¿Se dispone de un área de reposo o espera?", d: "Sillas, bancos o sectores confortables.", g: "medio" },
    { t: "¿El espacio está preparado para futura instalación de energía solar?", d: "Espacio físico, estructura y capacidad eléctrica.", g: "medio" }
  ]
};

/* ============================================================
   MEJORAS
=========================================================== */

const mejoras = {
  "form2_1": { tipo: "MS", texto: ["Instalar extractores de aire.", "Agregar aberturas para ventilación cruzada, preferentemente altas."] },
  "form2_2": { tipo: "MR", texto: ["Instalación o reparación del aire acondicionado."] },
  "form2_3": { tipo: "MR", texto: ["Instalación o reparación de ventiladores."] },
  "form3_2": { tipo: "MR", texto: ["Adaptación del ingreso para personas con movilidad reducida."] },
  "form4_0": { tipo: "MS", texto: ["Instalar cielorraso.", "Pintar techos de color claro.", "Agregar aislación térmica."] },
  "form5_0": { tipo: "MR", texto: ["Agregar cortinas, toldos o elementos de sombra."] },
  "form5_1": { tipo: "MS", texto: ["Agregar vegetación o parasoles al norte."] },
  "form5_2": { tipo: "MS", texto: ["Agregar vegetación o parasoles al oeste."] },
  "form6_1": { tipo: "MS", texto: ["Instalación de tela mosquitera."] },
  "form7_0": { tipo: "MR", texto: ["Colocar dispenser de agua fría."] },
  "form7_1": { tipo: "MR", texto: ["Incorporar sillas o bancos."] },
  "form7_2": { tipo: "MS", texto: ["Realizar estudios para posible instalación solar."] }
};

/* ============================================================
   GENERACIÓN DE FORMULARIOS
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
            onclick="seleccionarRespuesta('${idBloque}', ${index}, 'si', this)">Sí</button>
          <button class="btn-resp btn-no-${preg.g}"
            onclick="seleccionarRespuesta('${idBloque}', ${index}, 'no', this)">No</button>
        </div>`;
      cont.appendChild(div);
    });
  });
}

/* ============================================================
   RESPUESTAS
=========================================================== */

function seleccionarRespuesta(bloque, index, valor, boton) {
  respuestas[`${bloque}_${index}`] = valor;
  boton.closest(".opciones")
    .querySelectorAll(".btn-resp")
    .forEach(b => b.classList.remove("seleccionado"));
  boton.classList.add("seleccionado");
}

function setDatoGeneral(campo, valor, boton) {
  datosGenerales[campo] = valor;
  const cont = boton.closest(".yesno-container");
  cont.querySelectorAll("button").forEach(b => b.classList.remove("seleccionado"));
  boton.classList.add("seleccionado");
}

/* ============================================================
   NAVEGACIÓN
=========================================================== */

let pasoActual = 1;

function mostrarPaso(n) {
  document.querySelectorAll(".step").forEach(d => d.classList.remove("active"));
  document.getElementById("step" + n).classList.add("active");
}

function nextStep() {
  pasoActual = Math.min(pasoActual + 1, 8);
  mostrarPaso(pasoActual);
}

function prevStep() {
  pasoActual = Math.max(pasoActual - 1, 1);
  mostrarPaso(pasoActual);
}

/* ============================================================
   DOM READY
=========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  generarFormularios();

  const m2 = document.getElementById("m2");
  const cap = document.getElementById("capacidadTexto");

  m2.addEventListener("input", () => {
    const val = parseFloat(m2.value) || 0;
    cap.innerHTML = `<strong>Personas permitidas:</strong> ${Math.floor(val / 3.5)}`;
  });
});

/* ============================================================
   CLASIFICACIÓN Y RESULTADO
=========================================================== */

function obtenerMejoras() {
  let sugeridas = [], requeridas = [];
  Object.keys(mejoras).forEach(k => {
    if (respuestas[k] === "no") {
      mejoras[k].tipo === "MR"
        ? requeridas.push(...mejoras[k].texto)
        : sugeridas.push(...mejoras[k].texto);
    }
  });
  return { sugeridas, requeridas };
}

function clasificarPunto() {
  let muy = 0, gra = 0, med = 0;
  Object.keys(respuestas).forEach(k => {
    const [b, i] = k.split("_");
    const g = bloques[b][i].g;
    if (respuestas[k] === "no") {
      if (g === "muygrave") muy++;
      if (g === "grave") gra++;
      if (g === "medio") med++;
    }
  });
  if (respuestas["form7_0"] === "no" || muy >= 1 || gra >= 4 || med >= 6) return "rojo";
  if (gra >= 2 || med >= 3) return "amarillo";
  return "verde";
}

function calcular() {
  const estado = clasificarPunto();
  const { sugeridas, requeridas } = obtenerMejoras();
  const m2 = parseFloat(document.getElementById("m2").value) || 0;

  let html = `<h2>${estado === "rojo" ? "🟥 Área NO apta" : estado === "amarillo" ? "🟡 Área apta con mejoras" : "🟢 Área apta"}</h2>
  <p><strong>Área:</strong> ${m2} m²</p>
  <p><strong>Capacidad:</strong> ${Math.floor(m2 / 3.5)} personas</p>`;

  if (requeridas.length || sugeridas.length) {
    html += `<h3>Medidas de mejora</h3>`;
    if (requeridas.length) html += `<h4>🔴 Requeridas</h4><ul>${requeridas.map(m => `<li>${m}</li>`).join("")}</ul>`;
    if (sugeridas.length) html += `<h4>🟡 Sugeridas</h4><ul>${sugeridas.map(m => `<li>${m}</li>`).join("")}</ul>`;
  }

  html += `<h3>Observaciones</h3><textarea id="comentarios"></textarea>`;
  document.getElementById("resultado").innerHTML = html;
  nextStep();
}

/* ============================================================
   PDF
=================

function descargarPDF() {
  const res = document.getElementById("resultado").cloneNode(true);
  const t = res.querySelector("#comentarios");
  if (t) {
    const p = document.createElement("p");
    p.innerHTML = t.value ? t.value.replace(/\n/g, "<br>") : "<em>Sin observaciones</em>";
    t.replaceWith(p);
  }
  const w = window.open("");
  w.document.write(`<html><body>${res.innerHTML}</body></html>`);
  w.document.close();
  w.print();
} 
